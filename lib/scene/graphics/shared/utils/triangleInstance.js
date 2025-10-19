'use strict';

var Triangle = require('triangle-wasm');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
"use strict";
let triangleInstance = null;
let triangleInitialized = false;
const wasmPath = new URL("../../gl/triangle.out.wasm", (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('scene/graphics/shared/utils/triangleInstance.js', document.baseURI).href))).href;
function getTriangleInstance() {
  if (!triangleInitialized) {
    console.warn("Triangle-wasm not yet initialized. Call initTriangleWasm() during app startup.");
  }
  return triangleInstance;
}
async function initTriangleWasm() {
  if (!triangleInstance) {
    triangleInstance = await Triangle.init(wasmPath);
    triangleInitialized = true;
  }
  return triangleInstance;
}

exports.getTriangleInstance = getTriangleInstance;
exports.initTriangleWasm = initTriangleWasm;
//# sourceMappingURL=triangleInstance.js.map
