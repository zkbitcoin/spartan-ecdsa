/*
import {
  MembershipProver,
  MembershipVerifier,
  Tree,
  Poseidon,
  defaultAddressMembershipPConfig,
  defaultPubkeyMembershipPConfig,
  defaultPubkeyMembershipVConfig,
  defaultAddressMembershipVConfig
} from "@personaelabs/spartan-ecdsa";
*/
import {
  addHexPrefix, bytesToBigInt,
  ecrecover,
  ecsign,
  hashPersonalMessage,
  privateToAddress,
  privateToPublic,
  pubToAddress
} from "@ethereumjs/util";
import { Poseidon } from "@personaelabs/spartan-ecdsa/src/helpers/poseidon";
import { Tree } from "@personaelabs/spartan-ecdsa/src/helpers/tree";
import { MembershipProver } from "@personaelabs/spartan-ecdsa/src/core/prover";
import {
  defaultAddressMembershipPConfig, defaultAddressMembershipVConfig,
  defaultPubkeyMembershipPConfig,
  defaultPubkeyMembershipVConfig
} from "@personaelabs/spartan-ecdsa/src";
import { MembershipVerifier } from "@personaelabs/spartan-ecdsa/src/core/verifier";
import { ProveArgs } from "@personaelabs/spartan-ecdsa/src/types";

export default function Home() {
  const provePubKeyMembership = async () => {
    const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
    const msg = Buffer.from("harry potter");
    const msgHash = hashPersonalMessage(msg);

    const { v, r, s } = ecsign(msgHash, privKey);
    const pubKey = Buffer.from(ecrecover(msgHash, v, r, s));
    //const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
    const sig = addHexPrefix(Buffer.from(r).toString('hex') +Buffer.from(s).toString('hex') + v.toString(16));


    const poseidon = new Poseidon();
    await poseidon.initWasm();

    const treeDepth = 20;
    const pubKeyTree = new Tree(treeDepth, poseidon);

    const proverPubKeyHash = poseidon.hashPubKey(pubKey);

    pubKeyTree.insert(proverPubKeyHash);

    // Insert other members into the tree
    for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
      const pubKey = Buffer.from(privateToPublic(
        Buffer.from("".padStart(16, member), "utf16le")
      ));
      pubKeyTree.insert(poseidon.hashPubKey(pubKey));
    }

    const index = pubKeyTree.indexOf(proverPubKeyHash);
    const merkleProof = pubKeyTree.createProof(index);

    console.log("Proving...");
    console.time("Full proving time");

    const prover = new MembershipProver({
      ...defaultPubkeyMembershipPConfig,
      enableProfiler: true
    });

    await prover.initWasm();


    const { proof, publicInput } = await prover.prove(
      {
        sig,
        msgHash,
        merkleProof
      } as ProveArgs
    );

    console.timeEnd("Full proving time");
    console.log(
      "Raw proof size (excluding public input)",
      proof.length,
      "bytes"
    );

    console.log("Verifying...");
    const verifier = new MembershipVerifier({
      ...defaultPubkeyMembershipVConfig,
      enableProfiler: true
    });
    await verifier.initWasm();

    console.time("Verification time");
    const ser = publicInput.serialize();
    const result = await verifier.verify({ proof, publicInputSer: ser });
    console.timeEnd("Verification time");

    if (result) {
      console.log("Successfully verified proof!");
    } else {
      console.log("Failed to verify proof :(");
    }
  };

  const proverAddressMembership = async () => {
    const privKey = Buffer.from("".padStart(16, "🧙"), "utf16le");
    const msg = Buffer.from("harry potter");
    const msgHash = hashPersonalMessage(msg);

    const { v, r, s } = ecsign(msgHash, privKey);
    //const sig = `0x${r.toString("hex")}${s.toString("hex")}${v.toString(16)}`;
    const sig = addHexPrefix(Buffer.from(r).toString('hex') +Buffer.from(s).toString('hex') + v.toString(16));


    const poseidon = new Poseidon();
    await poseidon.initWasm();

    const treeDepth = 20;
    const addressTree = new Tree(treeDepth, poseidon);

    const proverAddress = bytesToBigInt(
      //"0x" + privateToAddress(privKey).toString("hex")
      privateToAddress(privKey)
    );
    addressTree.insert(proverAddress);

    // Insert other members into the tree
    for (const member of ["🕵️", "🥷", "👩‍🔬"]) {
      const pubKey = privateToPublic(
        Buffer.from("".padStart(16, member), "utf16le")
      );
      //const address = BigInt("0x" + pubToAddress(pubKey).toString("hex"));
      const address= bytesToBigInt( pubToAddress(pubKey));
      addressTree.insert(address);
    }

    const index = addressTree.indexOf(proverAddress);
    const merkleProof = addressTree.createProof(index);

    console.log("Proving...");
    console.time("Full proving time");

    const prover = new MembershipProver({
      ...defaultAddressMembershipPConfig,
      enableProfiler: true
    });

    await prover.initWasm();

    const { proof, publicInput } = await prover.prove(
      {
        sig,
        msgHash,
        merkleProof
      } as ProveArgs
    );

    console.timeEnd("Full proving time");
    console.log(
      "Raw proof size (excluding public input)",
      proof.length,
      "bytes"
    );

    console.log("Verifying...");
    const verifier = new MembershipVerifier({
      ...defaultAddressMembershipVConfig,
      enableProfiler: true
    });
    await verifier.initWasm();

    console.time("Verification time");
    const ser = publicInput.serialize();
    const result = await verifier.verify({proof, publicInputSer:ser});
    console.timeEnd("Verification time");

    if (result) {
      console.log("Successfully verified proof!");
    } else {
      console.log("Failed to verify proof :(");
    }
  };

  return (
    <div>
      <button onClick={provePubKeyMembership}>
        Prove Public Key Membership
      </button>
      <button onClick={proverAddressMembership}>
        Prove Address Membership
      </button>
    </div>
  );
}
