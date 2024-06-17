import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree";
export class Tree {
    constructor(depth, poseidon) {
        this.depth = depth;
        this.poseidon = poseidon;
        const hash = poseidon.hash.bind(poseidon);
        this.treeInner = new IncrementalMerkleTree(hash, this.depth, BigInt(0));
    }
    insert(leaf) {
        this.treeInner.insert(leaf);
    }
    delete(index) {
        this.treeInner.delete(index);
    }
    leaves() {
        return this.treeInner.leaves;
    }
    root() {
        return this.treeInner.root;
    }
    indexOf(leaf) {
        return this.treeInner.indexOf(leaf);
    }
    createProof(index) {
        const proof = this.treeInner.createProof(index);
        return {
            siblings: proof.siblings,
            pathIndices: proof.pathIndices,
            root: proof.root
        };
    }
    verifyProof(proof, leaf) {
        return this.treeInner.verifyProof(Object.assign(Object.assign({}, proof), { leaf }));
    }
}
//# sourceMappingURL=tree.js.map