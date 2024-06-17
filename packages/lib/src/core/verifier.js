var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defaultAddressVerifierConfig, defaultPubkeyVerifierConfig } from "@personaelabs/spartan-ecdsa/src/config";
import { Profiler } from "@personaelabs/spartan-ecdsa/src/helpers/profiler";
import { loadCircuit } from "@personaelabs/spartan-ecdsa/src/helpers/utils";
import { init, wasm } from "@personaelabs/spartan-ecdsa/src/wasm";
import { PublicInput, verifyEffEcdsaPubInput } from "@personaelabs/spartan-ecdsa/src/helpers/publicInputs";
/**
 * ECDSA Membership Verifier
 */
export class MembershipVerifier extends Profiler {
    constructor({ circuit, enableProfiler, useRemoteCircuit }) {
        super({ enabled: enableProfiler });
        if (circuit === defaultAddressVerifierConfig.circuit ||
            circuit === defaultPubkeyVerifierConfig.circuit) {
            console.warn(`
      Spartan-ecdsa default config warning:
      We recommend using defaultPubkeyMembershipPConfig/defaultPubkeyMembershipVConfig only for testing purposes.
      Please host and specify the circuit and witnessGenWasm files on your own server for sovereign control.
      Download files: https://github.com/personaelabs/spartan-ecdsa/blob/main/packages/lib/README.md#circuit-downloads
      `);
        }
        this.circuit = circuit;
        this.useRemoteCircuit =
            useRemoteCircuit || typeof window !== "undefined";
    }
    initWasm() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init();
        });
    }
    verify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ proof, publicInputSer }) {
            this.time("Load circuit");
            const circuitBin = yield loadCircuit(this.circuit, this.useRemoteCircuit);
            this.timeEnd("Load circuit");
            this.time("Verify public input");
            const publicInput = PublicInput.deserialize(publicInputSer);
            const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
            this.timeEnd("Verify public input");
            this.time("Verify proof");
            let isProofValid;
            try {
                isProofValid = yield wasm.verify(circuitBin, proof, publicInput.circuitPubInput.serialize());
            }
            catch (_e) {
                isProofValid = false;
            }
            this.timeEnd("Verify proof");
            return isProofValid && isPubInputValid;
        });
    }
}
//# sourceMappingURL=verifier.js.map