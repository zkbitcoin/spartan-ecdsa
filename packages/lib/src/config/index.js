// Default configs for pubkey membership proving/verifying
export const defaultPubkeyProverConfig = {
    witnessGenWasm: "https://storage.googleapis.com/personae-proving-keys/membership/pubkey_membership.wasm",
    circuit: "https://storage.googleapis.com/personae-proving-keys/membership/pubkey_membership.circuit"
};
export const defaultPubkeyVerifierConfig = {
    circuit: defaultPubkeyProverConfig.circuit
};
// Default configs for address membership proving/verifyign
export const defaultAddressProverConfig = {
    witnessGenWasm: "https://storage.googleapis.com/personae-proving-keys/membership/addr_membership.wasm",
    circuit: "https://storage.googleapis.com/personae-proving-keys/membership/addr_membership.circuit"
};
export const defaultAddressVerifierConfig = {
    circuit: defaultAddressProverConfig.circuit
};
//# sourceMappingURL=index.js.map