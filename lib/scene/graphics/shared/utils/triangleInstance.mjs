import Triangle from 'triangle-wasm';
import wasmBase64 from '../../gl/triangle.wasm.base64.mjs';

"use strict";
let triangleInstance = null;
let triangleInitialized = false;
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
function getWasmBlobUrl() {
  const arrayBuffer = base64ToArrayBuffer(wasmBase64);
  const blob = new Blob([arrayBuffer], { type: "application/wasm" });
  return URL.createObjectURL(blob);
}
function getTriangleInstance() {
  if (!triangleInitialized) {
    console.warn("Triangle-wasm not yet initialized. Call initTriangleWasm() during app startup.");
  }
  return triangleInstance;
}
async function initTriangleWasm() {
  if (!triangleInstance) {
    const wasmUrl = getWasmBlobUrl();
    triangleInstance = await Triangle.init(wasmUrl);
    triangleInitialized = true;
    URL.revokeObjectURL(wasmUrl);
  }
  return triangleInstance;
}

export { getTriangleInstance, initTriangleWasm };
//# sourceMappingURL=triangleInstance.mjs.map
