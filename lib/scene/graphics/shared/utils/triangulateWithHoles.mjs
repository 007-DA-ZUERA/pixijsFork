import { getTriangleInstance } from './triangleInstance.mjs';

"use strict";
function holeIndicesToHoleList(pointlist, holeIndices, nudgeIfOnBoundary = false, nudgeEpsilon = 1e-9) {
  const out = [];
  const nPoints = pointlist.length / 2;
  for (const idx of holeIndices) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= nPoints) {
      throw new RangeError(`hole index ${idx} out of bounds`);
    }
    let x = pointlist[idx * 2];
    let y = pointlist[idx * 2 + 1];
    if (nudgeIfOnBoundary) {
      x = x + nudgeEpsilon * (idx % 2 === 0 ? 1 : -1);
      y = y + nudgeEpsilon * (idx % 3 === 0 ? 1 : -1);
    }
    out.push(x, y);
  }
  return out;
}
function triangulateWithHoles(points, holeIndices, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
  const triangle = getTriangleInstance();
  if (!triangle) {
    console.error("Triangle-wasm not initialized");
    return;
  }
  const holelist = holeIndices.length > 0 ? holeIndicesToHoleList(points, holeIndices, true, 1e-6) : [];
  const numPoints = points.length / 2;
  const segmentlist = [];
  for (let i = 0; i < numPoints; i++) {
    segmentlist.push(i, (i + 1) % numPoints);
  }
  const input = triangle.makeIO({
    pointlist: points,
    segmentlist,
    holelist
  });
  const output = triangle.makeIO();
  try {
    triangle.triangulate({ quality: true }, input, output);
    if (!output.trianglelist || output.trianglelist.length === 0) {
      console.log("Oh shit");
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
