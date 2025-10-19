import Triangle from 'triangle-wasm';
import wasmBase64 from '../../gl/triangle.wasm.base64.mjs';

"use strict";
let triangleInstance = null;
let triangleInitialized = false;
function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
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
    console.log("Initializing Triangle-wasm...");
    const wasmUrl = getWasmBlobUrl();
    await Triangle.init(wasmUrl);
    triangleInstance = Triangle;
    triangleInitialized = true;
    URL.revokeObjectURL(wasmUrl);
    console.log("Triangle-wasm initialized successfully");
  }
  return triangleInstance;
}

export { getTriangleInstance, initTriangleWasm };
//# sourceMappingURL=triangleInstance.mjs.map
