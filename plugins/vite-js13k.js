import { Packer } from 'roadroller';
import htmlMinifier from 'html-minifier';
import JSZip from 'jszip';
import fs from 'fs';

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
        console.log(`\nZip size: ${fs.statSync('dist/game.zip').size}B`);
        resolve();
      });
  });
}

function removePreloads(scriptCode) {
  const preloadMatch = scriptCode.match(/!function\(\)(?:(?!\(\))[\s\S])*\(\);/);
  return scriptCode.replace(preloadMatch, '');
}

export async function replaceScript(html, scriptFilename, scriptCode) {
  const reScript = new RegExp(`<script([^>]*?) src="[./]*${scriptFilename}"([^>]*)></script>`);

  // First we have to move the script to the end of the body, because vite is
  // opinionated and otherwise just hoists it into <head>:
  // https://github.com/vitejs/vite/issues/7838
  const _html = html
    .replace('</body>', html.match(reScript)[0] + '</body')
    .replace(html.match(reScript)[0], '');

  const packer = new Packer([{
    data: removePreloads(scriptCode),
    type: 'js',
    action: 'eval',
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
        zip(replacedHtml);
      }
      for (const name of bundlesToDelete) {
          delete bundle[name];
      }
    },
  };
}
