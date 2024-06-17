import {
  hashPersonalMessage,
  privateToAddress,
  ecsign, bytesToBigInt, addHexPrefix
} from "@ethereumjs/util";
/*
import {
  Tree,
  Poseidon,
  MembershipProver,
  MembershipVerifier
} from "@personaelabs/spartan-ecdsa";
 */
import * as path from "path";
import { Poseidon } from "@personaelabs/spartan-ecdsa/src/helpers/poseidon";
import { Tree } from "@personaelabs/spartan-ecdsa/src/helpers/tree";
import { MembershipProver } from "@personaelabs/spartan-ecdsa/src/core/prover";
import { MembershipVerifier } from "@personaelabs/spartan-ecdsa/src/core/verifier";

const benchAddrMembership = async () => {
  const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
  const msg = Buffer.from("harry potter");
  const msgHash = hashPersonalMessage(msg);
  let msgHashBuffer: Buffer = msgHash as Buffer

  const { v, r, s } = ecsign(msgHash, privKey);
  //const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
  const sig = addHexPrefix(Buffer.from(r).toString('hex') +Buffer.from(s).toString('hex') + v.toString(16));


  // Init the Poseidon hash
  const poseidon = new Poseidon();
  await poseidon.initWasm();

  const treeDepth = 20;
  const tree = new Tree(treeDepth, poseidon);

  // Get the prover public key hash
  const proverAddress =
    //"0x" + privateToAddress(privKey).toString("hex")
    bytesToBigInt(privateToAddress(privKey)
  );

  // Insert prover public key hash into the tree
  tree.insert(proverAddress);

  // Insert other members into the tree
  for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
    const address = bytesToBigInt(
      //"0x" + privateToAddress(Buffer.from("".padStart(16, member), "utf16le")).toString("hex")
      privateToAddress(Buffer.from("".padStart(16, member), "utf16le"))
    );
    tree.insert(address);
  }

  // Compute the merkle proof
  const index = tree.indexOf(proverAddress);

  const proverConfig = {
    circuit: path.join(
      __dirname,
      "../../../circuits/build/addr_membership/addr_membership.circuit"
    ),
    witnessGenWasm: path.join(
      __dirname,
      "../../../circuits/build/addr_membership/addr_membership_js/addr_membership.wasm"
    ),
    enableProfiler: true
  };
  const merkleProof = tree.createProof(index);

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

export default benchAddrMembership;
