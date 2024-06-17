var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
const snarkJs = require("snarkjs");
import { fromRpcSig } from "@ethereumjs/util";
import * as fs from "fs";
export const snarkJsWitnessGen = (input, wasmFile) => __awaiter(void 0, void 0, void 0, function* () {
    const witness = {
        type: "mem"
    };
    yield snarkJs.wtns.calculate(input, wasmFile, witness);
    return witness;
});
/**
 * Load a circuit from a file or URL
 */
export const loadCircuit = (pathOrUrl, useRemoteCircuit) => __awaiter(void 0, void 0, void 0, function* () {
    if (useRemoteCircuit) {
        return yield fetchCircuit(pathOrUrl);
    }
    else {
        return yield readCircuitFromFs(pathOrUrl);
    }
});
const readCircuitFromFs = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const bytes = fs.readFileSync(path);
    return new Uint8Array(bytes);
});
const fetchCircuit = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const circuit = yield response.arrayBuffer();
    return new Uint8Array(circuit);
});
export const bytesToBigInt = (bytes) => BigInt("0x" + Buffer.from(bytes).toString("hex"));
export const bytesLeToBigInt = (bytes) => {
    const reversed = bytes.reverse();
    return bytesToBigInt(reversed);
};
export const bigIntToBytes = (n, size) => {
    const hex = n.toString(16);
    const hexPadded = hex.padStart(size * 2, "0");
    return Buffer.from(hexPadded, "hex");
};
export const bigIntToLeBytes = (n, size) => {
    const bytes = bigIntToBytes(n, size);
    return bytes.reverse();
};
export const fromSig = (sig) => {
    const { r: _r, s: _s, v } = fromRpcSig(sig);
    //const r = BigInt("0x" + _r .toString("hex"));
    const r = bytesToBigInt(_r);
    //const s = BigInt("0x" + _s.toString("hex"));
    const s = bytesToBigInt(_s);
    return { r, s, v };
};
//# sourceMappingURL=utils.js.map