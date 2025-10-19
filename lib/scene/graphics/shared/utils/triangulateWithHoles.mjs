import { getTriangleInstance } from './triangleInstance.mjs';

"use strict";
function pointInPolygon(x, y, ring) {
  let inside = false;
  const n = ring.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = ring[i * 2];
    const yi = ring[i * 2 + 1];
    const xj = ring[j * 2];
    const yj = ring[j * 2 + 1];
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi || 1e-30) + xi;
    if (intersect)
      inside = !inside;
  }
  return inside;
}
function holeIndicesToHoleList(pointlist, holeIndices) {
  const seeds = [];
  const totalPoints = pointlist.length / 2;
  const ringStarts = [...holeIndices];
  for (let h = 0; h < ringStarts.length; h++) {
    const start = ringStarts[h];
    const end = h + 1 < ringStarts.length ? ringStarts[h + 1] - 1 : totalPoints - 1;
    if (end <= start)
      continue;
    const ring = [];
    for (let i = start; i <= end; i++) {
      ring.push(pointlist[i * 2], pointlist[i * 2 + 1]);
    }
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < ring.length; i += 2) {
      cx += ring[i];
      cy += ring[i + 1];
    }
    cx /= ring.length / 2;
    cy /= ring.length / 2;
    if (!pointInPolygon(cx, cy, ring)) {
      const vx = ring[0] - cx;
      const vy = ring[1] - cy;
      const len = Math.hypot(vx, vy) || 1;
      cx += vx / len * 1e-3;
      cy += vy / len * 1e-3;
      if (!pointInPolygon(cx, cy, ring)) {
        cx = (ring[0] + ring[2]) * 0.5;
        cy = (ring[1] + ring[3]) * 0.5;
        cx += 1e-3;
        cy += 1e-3;
      }
    }
    seeds.push(cx, cy);
  }
  return seeds;
}
function triangulateWithHoles(points, holeIndices, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
  const triangle = getTriangleInstance();
  if (!triangle) {
    console.error("Triangle-wasm not initialized");
    return;
  }
  const holelist = holeIndices.length > 0 ? holeIndicesToHoleList(points, holeIndices) : [];
  const numPoints = points.length / 2;
  const segmentlist = [];
  const ringStarts = holeIndices.length > 0 ? [0, ...holeIndices] : [0];
  for (let r = 0; r < ringStarts.length; r++) {
    const start = ringStarts[r];
    let end = r + 1 < ringStarts.length ? ringStarts[r + 1] - 1 : numPoints - 1;
    if (end > start) {
      const sx = points[start * 2];
      const sy = points[start * 2 + 1];
      const ex = points[end * 2];
      const ey = points[end * 2 + 1];
      if (sx === ex && sy === ey)
        end -= 1;
    }
    const ringCount = end - start + 1;
    if (ringCount <= 1)
      continue;
    for (let i = start; i < end; i++) {
      segmentlist.push(i, i + 1);
    }
    segmentlist.push(end, start);
  }
  const input = triangle.makeIO({
    pointlist: points,
    segmentlist,
    holelist
  });
  const output = triangle.makeIO();
  try {
    triangle.triangulate({}, input, output);
    console.log("Triangle output:", {
      numTriangles: output.numberoftriangles,
      numCorners: output.numberofcorners,
      hasTrianglelist: !!output.trianglelist,
      trianglelistLength: output.trianglelist?.length
    });
    if (!output.trianglelist || output.trianglelist.length === 0) {
      console.error("Triangle failed to generate triangles!");
      console.error("Input was:", { numPoints, numSegments: segmentlist.length / 2, numHoles: holelist.length / 2 });
      return;
    }
    console.log("triangulating :D");
    for (let i = 0; i < output.trianglelist.length; i += 3) {
      indices[indicesOffset++] = output.trianglelist[i] + verticesOffset;
      indices[indicesOffset++] = output.trianglelist[i + 1] + verticesOffset;
      indices[indicesOffset++] = output.trianglelist[i + 2] + verticesOffset;
    }
    let index = verticesOffset * verticesStride;
    for (let i = 0; i < points.length; i += 2) {
      vertices[index] = points[i];
      vertices[index + 1] = points[i + 1];
      index += verticesStride;
    }
  } finally {
    triangle.freeIO(input, true);
    triangle.freeIO(output);
  }
}

export { triangulateWithHoles };
//# sourceMappingURL=triangulateWithHoles.mjs.map
