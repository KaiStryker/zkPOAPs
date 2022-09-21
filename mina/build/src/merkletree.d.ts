import { SmartContract, Field, DeployArgs, State, CircuitValue, PrivateKey } from 'snarkyjs';
import { BytesLike } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";
import { MerkleTree } from 'snarkyjs/dist/node/lib/merkle_tree';
declare const MerkleWitness_base: typeof import("snarkyjs/dist/node/lib/merkle_tree").BaseMerkleWitness;
declare class MerkleWitness extends MerkleWitness_base {
}
declare class Account extends CircuitValue {
    publicKey: string;
    constructor(publicKey: string);
    hash(): Field;
}
export declare class zkPOAP extends SmartContract {
    commitment: State<Field>;
    index: State<bigint>;
    deploy(args: DeployArgs): void;
    init(initialCommitment: Field, initialIndex: bigint): void;
    proveAttendance(nullifierHash: Field, poapId: Field, account: Account, path: MerkleWitness): boolean;
    updateRoot(poapId: Field, account: Account, path: MerkleWitness): Field;
}
export declare function checkAttendance(digest: BytesLike, signature: SignatureLike, tokenId: bigint, poapId: bigint, nullifierHash: string, zkPOAPApp: zkPOAP, Tree: MerkleTree, feePayer: PrivateKey, zkAppKey: PrivateKey, doProofs: boolean): Promise<boolean>;
export declare function updateMerkle(digest: BytesLike, signature: SignatureLike, poapId: bigint, zkPOAPApp: zkPOAP, Tree: MerkleTree, feePayer: PrivateKey, zkAppKey: PrivateKey, doProofs: boolean): Promise<[Field, string]>;
export {};
