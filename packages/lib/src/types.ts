// The same structure as MerkleProof in @zk-kit/incremental-merkle-tree.
// Not directly using MerkleProof defined in @zk-kit/incremental-merkle-tree so
// library users can choose whatever merkle tree management method they want.
import { SpartanWasm } from "./wasm";

export interface MerkleProof {
  root: bigint;
  siblings: bigint[];
  pathIndices: number[];
}

export interface NIZK {
  proof: Uint8Array;
  publicInput: Uint8Array;
}

export interface ProverOptions {
  proverWasm?: string;

  witnessGenWasm?: string;
  circuit?: string;
  spartanWasm?: string;
  enableProfiler?: boolean;
}

export interface VerifyOptions {
  circuit?: string; // Path to circuit file compiled by Nova-Scotia
  spartanWasm?: string; // Path to spartan wasm file
  enableProfiler?: boolean;
}

export interface IProver {
  spartanWasm: SpartanWasm;
  circuit: string; // Path to circuit file compiled by Nova-Scotia
  witnessGenWasm: string; // Path to witness generator wasm file generated by Circom

  prove(...args: any): Promise<NIZK>;
}

export interface IVerifier {
  spartanWasm: SpartanWasm; // Path to spartan wasm file
  circuit: string; // Path to circuit file compiled by Nova-Scotia

  verify(proof: Uint8Array, publicInput: Uint8Array): Promise<boolean>;
}

export interface SpartanWasmOptions {
  spartanWasm?: string;
}
