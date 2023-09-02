const orientation = (p, q, r) => {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // Collinear
  return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
}

export const hull = (points) => {
  const hull = [];

  // Find the leftmost point (and the bottommost if there are ties)
  let leftmost = 0;

  for (let i = 1; i < points.length; i++) {
    if (
      points[i].x < points[leftmost].x
      ||
      (points[i].x === points[leftmost].x && points[i].y < points[leftmost].y)
    ) {
      leftmost = i;
    }
  }

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

  return hull;
}
