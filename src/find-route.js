import { paths } from './path';
import { gridWidth, gridHeight } from './svg';

// TODO: Prefer straight x/y over diagonals because they are actually shorter distance

const getGridData = () => {
  // This should be cached somewhere, maybe a second after a grid piece is placed
  const gridData = [];

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      gridData.push({ x, y, neighbors: [] });
    }
  }

  paths.forEach((path) => {
    // TODO: See why or how this fails?
    if (gridData) {
      gridData
        .find((d) => d.x === path.points[0].x && d.y === path.points[0].y)
        .neighbors
        .push({ x: path.points[1].x, y: path.points[1].y });

      gridData
        .find((d) => d.x === path.points[1].x && d.y === path.points[1].y)
        .neighbors
        .push({ x: path.points[0].x, y: path.points[0].y });
    }
  });

  return gridData;
};

const breadthFirstSearch = (gridData, from, to) => {
  const queue = [{ node: from, path: [] }];
  const visited = [];

  // console.log('from');
  // console.log(from);

  // console.log('QUEUE:');
  // console.log(JSON.stringify(queue));

  while (queue.length) {
    const { node, path } = queue.shift();

    if (node === undefined) {
      // Not sure how nodes could be undefined but fine?
      return false; // TODO: See if returning nothing (void) saves space
    }

    if (to.find((t) => node.x === t.x && node.y === t.y)) {
      return path.concat(node);
    }

    const hasVisited = visited
      .some((visitedNode) => visitedNode.x === node.x && visitedNode.y === node.y);

    if (!hasVisited) {
      visited.push(node);

      node.neighbors.forEach((neighbor) => {
        const hasVisitedNeighbor = visited
          .some((visitedNode) => visitedNode.x === neighbor.x && visitedNode.y === neighbor.y);

        if (!hasVisitedNeighbor) {
          queue.push({
            node: gridData.find((c) => c.x === neighbor.x && c.y === neighbor.y),
            path: path.concat(node),
          });
        }
      });
    }
  }

  return null; // Can't get there at all!
};

export const findRoute = ({ from, to }) => {
  const gridData = getGridData();

  // Convert from and to to actual grid nodes
  const fromNode = gridData.find((c) => c.x === from.x && c.y === from.y);
  const toNodes = gridData.filter((c) => to.find((f) => c.x === f.x && c.y === f.y));

  // console.log('fromNode');
  // console.log(fromNode);

  // console.log('toNodes:');
  // console.log(toNodes);

  return breadthFirstSearch(
    gridData,
    fromNode,
    toNodes,
  );
};
