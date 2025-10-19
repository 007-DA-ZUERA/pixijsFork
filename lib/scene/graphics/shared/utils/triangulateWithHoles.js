'use strict';

var triangleInstance = require('./triangleInstance.js');

"use strict";
function triangulateWithHoles(points, holes, vertices, verticesStride, verticesOffset, indices, indicesOffset) {
  const triangle = triangleInstance.getTriangleInstance();
  if (!triangle) {
    console.error("Triangle-wasm not initialized");
    return;
  }
  const numPoints = points.length / 2;
  const segmentlist = [];
  for (let i = 0; i < numPoints; i++) {
    segmentlist.push(i, (i + 1) % numPoints);
  }
  const holelist = [];
  if (holes && holes.length > 0) {
    for (let i = 0; i < holes.length; i += 2) {
      holelist.push(holes[i], holes[i + 1]);
    }
  }
  const input = triangle.makeIO({
    pointlist: points,
    numberofpoints: numPoints,
    segmentlist,
    numberofsegments: segmentlist.length / 2,
    holelist,
    numberofholes: holelist.length / 2
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
    triangle.freeIO(input);
    triangle.freeIO(output);
  }
}

exports.triangulateWithHoles = triangulateWithHoles;
//# sourceMappingURL=triangulateWithHoles.js.map
