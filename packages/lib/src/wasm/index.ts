import * as wasm from "./wasm.js";

import { wasmBytes } from "./wasmBytes.ts";

export const init = async () => {
  await wasm.initSync(wasmBytes.buffer);
  wasm.init_panic_hook();
};

export { wasm };
