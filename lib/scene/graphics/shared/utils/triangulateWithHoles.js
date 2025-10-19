'use strict';

var triangleInstance = require('./triangleInstance.js');

"use strict";
function triangulateWithHoles(points, _holes, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
  const triangle = triangleInstance.getTriangleInstance();
  if (!triangle) {
    console.error("Triangle-wasm not initialized");
    return;
  }
  const input = triangle.makeIO({
    pointlist: points
  });
  const output = triangle.makeIO();
  try {
    triangle.triangulate({ quality: true }, input, output);
    if (!output.trianglelist || output.trianglelist.length === 0) {
      return;
    }
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

exports.triangulateWithHoles = triangulateWithHoles;
//# sourceMappingURL=triangulateWithHoles.js.map
