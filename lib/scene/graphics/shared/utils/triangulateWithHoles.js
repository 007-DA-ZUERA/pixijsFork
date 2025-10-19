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
  const pointIndices = [];
  for (let i = 0; i < numPoints; i++) {
    pointIndices.push(i);
  }
  const input = {
    pointlist: points,
    numberofpoints: numPoints,
    segmentlist: [],
    numberofsegments: 0,
    holelist: [],
    numberofholes: 0
  };
  for (let i = 0; i < numPoints; i++) {
    input.segmentlist.push(i, (i + 1) % numPoints);
  }
  input.numberofsegments = numPoints;
  if (holes && holes.length > 0) {
    for (let i = 0; i < holes.length; i += 2) {
      input.holelist.push(holes[i], holes[i + 1]);
    }
    input.numberofholes = holes.length / 2;
  }
  const output = triangle.triangulate(input, "pzQ");
  if (!output || !output.trianglelist) {
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
}

exports.triangulateWithHoles = triangulateWithHoles;
//# sourceMappingURL=triangulateWithHoles.js.map
