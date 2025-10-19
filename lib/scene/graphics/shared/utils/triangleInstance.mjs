import Triangle from 'triangle-wasm';

"use strict";
let triangleInstance = null;
let triangleInitialized = false;
function getTriangleInstance() {
  if (!triangleInitialized) {
    console.warn("Triangle-wasm not yet initialized. Call initTriangleWasm() during app startup.");
  }
  return triangleInstance;
}
async function initTriangleWasm() {
  if (!triangleInstance) {
    triangleInstance = await Triangle.init();
    triangleInitialized = true;
  }
  return triangleInstance;
}

export { getTriangleInstance, initTriangleWasm };
//# sourceMappingURL=triangleInstance.mjs.map
