import { zkPOAP } from "./merkletree";
import { Field, PrivateKey } from 'snarkyjs';
import { MerkleTree } from "snarkyjs/dist/node/lib/merkle_tree";
export declare function deploy(zkAppInstance: zkPOAP, zkAppPrivateKey: PrivateKey, account: PrivateKey, initialCommitment: Field, initialIndex: bigint): Promise<zkPOAP>;
export declare function createLocalBlockchain(): PrivateKey;
export declare function createEnvironment(): Promise<[zkPOAP, PrivateKey, MerkleTree, PrivateKey]>;
