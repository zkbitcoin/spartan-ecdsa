mkdir -p ./circuits/build/eddsa
circom ./circuits/eddsa/eddsa.circom --r1cs --wasm --prime curve25519 -o ./circuits/build/eddsa