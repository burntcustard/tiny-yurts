import { Packer } from 'roadroller';
import htmlMinifier from 'html-minifier';
import JSZip from 'jszip';
import fs from 'fs';
import advzip from 'advzip-bin';
import  { execFile } from 'child_process';

async function zip(content) {
  const jszip = new JSZip();

  jszip.file(
    'index.html',
    content,
    {
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    },
  );

  await new Promise((resolve) => {
    jszip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream('dist/game.zip'))
      .on('finish', () => {
        resolve();
      });
  });
}

export async function replaceScript(html, scriptFilename, scriptCode) {
  const reScript = new RegExp(`<script([^>]*?) src="[./]*${scriptFilename}"([^>]*)></script>`);

  // First we have to move the script to the end of the body, because vite is
  // opinionated and otherwise just hoists it into <head>:
  // https://github.com/vitejs/vite/issues/7838
  const _html = html
    .replace('</body>', html.match(reScript)[0] + '</body')
    .replace(html.match(reScript)[0], '');

  let code = scriptCode;
  console.log(`\nJS size: ${new Blob([code]).size}B (pre-custom-replace)`);
  fs.writeFileSync('dist/minified.js', code);
  code = code
    // .replace(/acceleration/g, '_acceleration')
  //   .replace(/createElement\("([^"]+)"\)/g, 'createElement`$1`')
  //   .replace(/.rotation/g, '._rotation')
  //   .replace(/createElement\("([^"]+)"\)/g, 'createElement`$1`');
  // fs.writeFileSync('dist/raw-replaced.js', code)
  console.log(`\nJS size: ${new Blob([code]).size}B (post-custom-replace)`);

  const packer = new Packer([{
    data: scriptCode,
    type: 'js',
    action: 'eval',
    allowFreeVars: true,
  }], {});

  await packer.optimize(); // takes less than 10 seconds by default

  const { firstLine, secondLine } = packer.makeDecoder();

  return _html.replace(reScript, `<script>${firstLine + secondLine}</script>`);
}

export function replaceCss(html, scriptFilename, scriptCode) {
  const reCss = new RegExp(`<link[^>]*? href="[./]*${scriptFilename}"[^>]*?>`);

  return html.replace(reCss, `<style type="text/css">\n${scriptCode}\n</style>`);
}

function replaceHtml(html) {
  const _html = htmlMinifier.minify(html, {
    collapseWhitespace: true,
    removeAttributeQuotes: true,
  });

  return _html
    .replace('<!DOCTYPE html>', '')
    .replace('<meta charset=UTF-8>', '')
    .replace('"width=device-width,initial-scale=1"', 'width=device-width,initial-scale=1')
    .replace(/ lang=[^>]*/, '');
}

const fileRegex = /\.js$/

function customReplacement(src) {
  // console.log(src);

  const replaced = src
    // Minify CSS template literals. Use `` to wrap CSS in JS even when no
    // variables are present, to apply the following. Some strings, like
    // 'Highscore:' could be broken by this and must be fixed during the build
    .replace(/`[^`]+`/g, tag => tag
      .replace(/`\s+/, '`')  // Remove newlines & spaces at start or string
      .replace(/\n\s+/g, '') // Remove newlines & spaces within values
      .replace(/:\s+/g, ':')  // Remove spaces in between property & values
      .replace(/\,\s+/g, ',') // Remove space after commas
      .replace(/\s{/g, '{') // Remove space in between identifier & opening squigly
      .replace(/([a-z])\s+\./g, '$1.') // Remove space between transition timing & .s
      .replace(/(%) ([\d$])/g, '$1$2') // Remove space between '100% 50%' in hwb()
      .replace(/\s\/\s/g, '/') // Remove spaces around `/` in hsl
      .replace(/;\s+/g, ';') // Remove newlines & spaces after semicolons
      .replace(/\)\s/g, ')') // Remove spaces after closing brackets
      .replace(/;}/g, '}') // Remove final semicolons in blocks
      .replace(/;`/, '`') // Remove final semicolons in cssText
    )
    .replace(/M0 0l/g, 'M0 0 ') // Don't need line char, can just use space instead
    .replace(/M0 0L/g, 'M0 0 ')
    .replace(/upgrade/g, '_upgrade')
    // .replace(/type/g, '_type') // Breaks Web Audio API
    .replace(/parent/g, '_parent')
    .replace(/points/g, '_points')
    .replace(/locked/g, '_locked')
      // Replace const with let declartion
    .replaceAll('const ', 'let ')
    // Replace all strict equality comparison with abstract equality comparison
    .replaceAll('===', '==')
    .replaceAll('!==', '!=')
    // Fix accidentally "minified" highscore text
    .replaceAll('Highscore:', 'Highscore: ')
    // .replace(/update/g, '_update')

  return replaced;
}

export function viteJs13kPre() {
  return {
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: customReplacement(src),
          map: null
        }
      }
    }
  }
}

export function viteJs13k() {
  return {
    enforce: "post",
    generateBundle: async (_, bundle) => {
      const jsExtensionTest = /\.[mc]?js$/;
      const htmlFiles = Object.keys(bundle).filter((i) => i.endsWith(".html"));
      const cssAssets = Object.keys(bundle).filter((i) => i.endsWith(".css"));
      const jsAssets = Object.keys(bundle).filter((i) => jsExtensionTest.test(i));
      const bundlesToDelete = [];
      for (const name of htmlFiles) {
        const htmlChunk = bundle[name];
        let replacedHtml = htmlChunk.source;

        for (const jsName of jsAssets) {
          const jsChunk = bundle[jsName];
          if (jsChunk.code != null) {
            bundlesToDelete.push(jsName);
            replacedHtml = await replaceScript(replacedHtml, jsChunk.fileName, jsChunk.code);
          }
        }

        for (const cssName of cssAssets) {
          const cssChunk = bundle[cssName];
          bundlesToDelete.push(cssName);
          replacedHtml = replaceCss(replacedHtml, cssChunk.fileName, cssChunk.source);
        }

        replacedHtml = replaceHtml(replacedHtml);
        htmlChunk.source = replacedHtml;
        await zip(replacedHtml);
      }
      for (const name of bundlesToDelete) {
          delete bundle[name];
      }
    },
    closeBundle: () => {
      console.log(`\nZip size: ${fs.statSync('dist/game.zip').size}B`);

      execFile(advzip, [
        '--recompress',
        '--shrink-insane',
        '--iter=5000',
        'dist/game.zip'
      ], (err) => {
        console.log(`\nZip size: ${fs.statSync('dist/game.zip').size}B (advzip)`);
      });
    },
  };
}
