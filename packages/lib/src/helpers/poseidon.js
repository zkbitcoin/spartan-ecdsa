var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { init, wasm } from "@personaelabs/spartan-ecdsa/src/wasm/";
import { bigIntToLeBytes, bytesLeToBigInt } from "./utils";
import { bytesToBigInt } from '@ethereumjs/util';
export class Poseidon {
    hash(inputs) {
        const inputsBytes = new Uint8Array(32 * inputs.length);
        for (let i = 0; i < inputs.length; i++) {
            inputsBytes.set(bigIntToLeBytes(inputs[i], 32), i * 32);
        }
        const result = wasm.poseidon(inputsBytes);
        return bytesLeToBigInt(result);
    }
    initWasm() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init();
        });
    }
    hashPubKey(pubKey) {
        //const pubKeyX = BigInt("0x" + pubKey.toString("hex").slice(0, 64));
        const pubKeyX = bytesToBigInt(pubKey.subarray(0, 64));
        //const pubKeyY = BigInt("0x" + pubKey.toString("hex").slice(64, 128));
        const pubKeyY = bytesToBigInt(pubKey.subarray(64, 128));
        const pubKeyHash = this.hash([pubKeyX, pubKeyY]);
        return pubKeyHash;
    }
}
//# sourceMappingURL=poseidon.js.map