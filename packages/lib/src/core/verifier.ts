import {
  defaultAddressVerifierConfig,
  defaultPubkeyVerifierConfig
} from "@personaelabs/spartan-ecdsa/src/config/index.ts";
import { Profiler } from "@personaelabs/spartan-ecdsa/src/helpers/profiler.ts";
import { loadCircuit } from "@personaelabs/spartan-ecdsa/src/helpers/utils.ts";
import { IVerifier, VerifyArgs, VerifyConfig } from "@personaelabs/spartan-ecdsa/src/types/index.ts";
import { init, wasm } from "@personaelabs/spartan-ecdsa/src/wasm/index.ts";
import { PublicInput, verifyEffEcdsaPubInput } from "@personaelabs/spartan-ecdsa/src/helpers/publicInputs.ts";

/**
 * ECDSA Membership Verifier
 */
export class MembershipVerifier extends Profiler implements IVerifier {
  circuit: string;
  useRemoteCircuit: boolean;

  constructor({
    circuit,
    enableProfiler,
    useRemoteCircuit
  }: VerifyConfig) {
    super({ enabled: enableProfiler });

    if (
      circuit === defaultAddressVerifierConfig.circuit ||
      circuit === defaultPubkeyVerifierConfig.circuit
    ) {
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

  async initWasm() {
    await init();
  }

  async verify({ proof, publicInputSer }: VerifyArgs): Promise<boolean> {
    this.time("Load circuit");
    const circuitBin = await loadCircuit(this.circuit, this.useRemoteCircuit);
    this.timeEnd("Load circuit");

    this.time("Verify public input");
    const publicInput = PublicInput.deserialize(publicInputSer);
    const isPubInputValid = verifyEffEcdsaPubInput(publicInput);
    this.timeEnd("Verify public input");

    this.time("Verify proof");
    let isProofValid;
    try {
      isProofValid = await wasm.verify(
        circuitBin,
        proof,
        publicInput.circuitPubInput.serialize()
      );
    } catch (_e) {
      isProofValid = false;
    }

    this.timeEnd("Verify proof");
    return isProofValid && isPubInputValid;
  }
}
