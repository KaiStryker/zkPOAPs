// Merkle Tree and off chain storage

import { Experimental, Field } from 'snarkyjs';

export { OffchainStorage };

class OffchainStorage<
  V extends {
    getHash(): Field;
  }
> extends Map<bigint, V> {
  private merkleTree;

  constructor(public readonly height: number) {
    super();
    this.merkleTree = new Experimental.MerkleTree(height);
  }

  set(key: bigint, value: V): this {
    super.set(key, value);
    this.merkleTree.setLeaf(key, value.getHash());
    return this;
  }

  get(key: bigint): V | undefined {
    return super.get(key);
  }

  getWitness(key: bigint): { isLeft: boolean; sibling: Field }[] {
    return this.merkleTree.getWitness(key);
  }

  getRoot(): Field {
    return this.merkleTree.getRoot();
  }
}