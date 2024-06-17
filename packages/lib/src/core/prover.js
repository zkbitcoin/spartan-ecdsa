var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Profiler } from "@personaelabs/spartan-ecdsa/src/helpers/profiler";
import { loadCircuit, fromSig, snarkJsWitnessGen } from "@personaelabs/spartan-ecdsa/src/helpers/utils";
import { PublicInput, computeEffEcdsaPubInput, CircuitPubInput } from "@personaelabs/spartan-ecdsa/src/helpers/publicInputs";
import { init, wasm } from "@personaelabs/spartan-ecdsa/src/wasm";
import { defaultAddressProverConfig, defaultPubkeyProverConfig } from "@personaelabs/spartan-ecdsa/src/config";
//import {
//  defaultPubkeyProverConfig,
//  defaultAddressProverConfig
//} from "@personaelabs/spartan-ecdsa/src/config";
/**
 * ECDSA Membership Prover
 */
export class MembershipProver extends Profiler {
    constructor({ enableProfiler, circuit, witnessGenWasm, useRemoteCircuit }) {
        super({ enabled: enableProfiler });
        if (circuit === defaultPubkeyProverConfig.circuit ||
            witnessGenWasm ===
                defaultPubkeyProverConfig.witnessGenWasm ||
            circuit === defaultAddressProverConfig.circuit ||
            witnessGenWasm === defaultAddressProverConfig.witnessGenWasm) {
            console.warn(`
      Spartan-ecdsa default config warning:
      We recommend using defaultPubkeyMembershipPConfig/defaultPubkeyMembershipVConfig only for testing purposes.
      Please host and specify the circuit and witnessGenWasm files on your own server for sovereign control.
      Download files: https://github.com/personaelabs/spartan-ecdsa/blob/main/packages/lib/README.md#circuit-downloads
      `);
        }
        this.circuit = circuit;
        this.witnessGenWasm = witnessGenWasm;
        this.useRemoteCircuit = useRemoteCircuit !== null && useRemoteCircuit !== void 0 ? useRemoteCircuit : false;
    }
    initWasm() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init();
        });
    }
    prove(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sig, msgHash, merkleProof }) {
            const { r, s, v } = fromSig(sig);
            const effEcdsaPubInput = computeEffEcdsaPubInput(r, v, msgHash);
            const circuitPubInput = new CircuitPubInput(merkleProof.root, effEcdsaPubInput.Tx, effEcdsaPubInput.Ty, effEcdsaPubInput.Ux, effEcdsaPubInput.Uy);
            const publicInput = new PublicInput(r, v, msgHash, circuitPubInput);
            const witnessGenInput = Object.assign(Object.assign({ s }, merkleProof), effEcdsaPubInput);
            this.time("Generate witness");
            const witness = yield snarkJsWitnessGen(witnessGenInput, this.witnessGenWasm);
            this.timeEnd("Generate witness");
            this.time("Load circuit");
            const useRemoteCircuit = this.useRemoteCircuit || typeof window !== "undefined";
            const circuitBin = yield loadCircuit(this.circuit, useRemoteCircuit);
            this.timeEnd("Load circuit");
            // Get the public input in bytes
            const circuitPublicInput = publicInput.circuitPubInput.serialize();
            this.time("Prove");
            const proof = wasm.prove(circuitBin, witness.data, circuitPublicInput);
            this.timeEnd("Prove");
            return {
                proof,
                publicInput
            };
        });
    }
}
//# sourceMappingURL=prover.js.map