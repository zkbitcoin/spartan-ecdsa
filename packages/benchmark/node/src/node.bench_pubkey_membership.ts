/*
import {
  MembershipProver,
  Poseidon,
  Tree,
  MembershipVerifier
} from "@personaelabs/spartan-ecdsa";
 */
import { Poseidon } from "@personaelabs/spartan-ecdsa/src/helpers/poseidon.ts";
import { Tree } from "@personaelabs/spartan-ecdsa/src/helpers/tree.ts";
import { MembershipProver } from "@personaelabs/spartan-ecdsa/src/core/prover.ts";
import { MembershipVerifier } from "@personaelabs/spartan-ecdsa/src/core/verifier.ts";
import {
  hashPersonalMessage,
  ecsign,
  ecrecover,
  privateToPublic, addHexPrefix
} from "@ethereumjs/util";

import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const benchPubKeyMembership = async () => {
  const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = Buffer.from(hashPersonalMessage(msg));
  let msgHashBuffer: Buffer = msgHash;

  const { v, r, s } = ecsign(msgHash, privKey);
  const pubKey = Buffer.from(ecrecover(msgHash, v, r, s));
  //const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
  const sig = addHexPrefix(Buffer.from(r).toString('hex') +Buffer.from(s).toString('hex') + v.toString(16));


  // Init the Poseidon hash
  const poseidon = new Poseidon();
  await poseidon.initWasm();

  const treeDepth = 20;
  const tree = new Tree(treeDepth, poseidon);

  // Get the prover public key hash
  const proverPubkeyHash = poseidon.hashPubKey(pubKey);

  // Insert prover public key hash into the tree
  tree.insert(proverPubkeyHash);

  // Insert other members into the tree
  for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
    const pubKey = Buffer.from(privateToPublic(
      Buffer.from("".padStart(16, member), "utf16le")
    ));
    tree.insert(poseidon.hashPubKey(pubKey));
  }

  // Compute the merkle proof
  const index = tree.indexOf(proverPubkeyHash);
  const merkleProof = tree.createProof(index);

  const proverConfig = {
    circuit: path.join(
      __dirname,
      "../../../circuits/build/pubkey_membership/pubkey_membership.circuit"
    ),
    witnessGenWasm: path.join(
      __dirname,
      "../../../circuits/build/pubkey_membership/pubkey_membership_js/pubkey_membership.wasm"
    ),
    enableProfiler: true
  };

  // Init the prover
  const prover = new MembershipProver(proverConfig);
  await prover.initWasm();

  // Prove membership
  const { proof, publicInput } = await prover.prove({sig, msgHash : msgHashBuffer, merkleProof});

  const verifierConfig = {
    circuit: proverConfig.circuit,
    enableProfiler: true
  };

  // Init verifier
  const verifier = new MembershipVerifier(verifierConfig);
  await verifier.initWasm();

  // Verify proof
  await verifier.verify({proof, publicInputSer: publicInput.serialize()});
};

export default benchPubKeyMembership;
