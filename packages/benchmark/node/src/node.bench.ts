import benchPubKeyMembership from "./node.bench_pubkey_membership.ts";
import benchAddressMembership from "./node.bench_addr_membership.ts";

const bench = async () => {
  await benchPubKeyMembership();
  await benchAddressMembership();
};

bench();
