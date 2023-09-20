// This is approx 50% ChatGPT and needs to be rewritten in my style (without do while!)

function orientation(p, q, r) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // Collinear
  return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
}

export const getOutlinePoints = (points) => {
  // Find the point with the lowest y-coordinate (and leftmost if ties)
  let leftmost = 0;
  for (let i = 1; i < points.length; i++) {
    if (
      points[i].y < points[leftmost].y
      || (
        points[i].y === points[leftmost].y
        && points[i].x < points[leftmost].x
      )
    ) {
      leftmost = i;
    }
  }

  const hull = [];
  let p = leftmost;

  do {
    hull.push(points[p]);
    let q = (p + 1) % points.length;

    for (let i = 0; i < points.length; i++) {
      if (orientation(points[p], points[i], points[q]) === 2) {
        q = i;
      }
    }

    p = q;
  } while (p !== leftmost);

  // Now, perform a true right-to-left pass to include points on the underside of the shape
  p = leftmost;

  do {
    let q = (p - 1 + points.length) % points.length; // Go backward in the array

    for (let i = 0; i < points.length; i++) {
      if (orientation(points[p], points[i], points[q]) === 2) {
        q = i;
      }
    }

    p = q;
    if (p !== leftmost) {
      hull.push(points[p]);
    }
  } while (p !== leftmost);

  return hull;
};
