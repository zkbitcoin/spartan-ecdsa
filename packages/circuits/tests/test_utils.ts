import { hashPersonalMessage, ecsign } from "@ethereumjs/util";
//import { computeEffEcdsaPubInput } from "@personaelabs/spartan-ecdsa";
import { computeEffEcdsaPubInput } from "@personaelabs/spartan-ecdsa/dist/src";

export const getEffEcdsaCircuitInput = (privKey: Buffer, msg: Buffer) => {
  const msgHash = hashPersonalMessage(msg);
  const { v, r: _r, s } = ecsign(msgHash, privKey);
  const r = BigInt("0x" + _r.toString("hex"));

  const circuitPubInput = computeEffEcdsaPubInput(r, v, msgHash);
  const input = {
    s: BigInt("0x" + s.toString("hex")),
    Tx: circuitPubInput.Tx,
    Ty: circuitPubInput.Ty,
    Ux: circuitPubInput.Ux,
    Uy: circuitPubInput.Uy
  };

  return input;
};

export const bytesToBigInt = (bytes: Uint8Array): bigint =>
  BigInt("0x" + Buffer.from(bytes).toString("hex"));
