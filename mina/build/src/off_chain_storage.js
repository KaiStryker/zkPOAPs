// Merkle Tree and off chain storage
import { Experimental } from 'snarkyjs';
export { OffchainStorage };
class OffchainStorage extends Map {
    height;
    merkleTree;
    constructor(height) {
        super();
        this.height = height;
        this.merkleTree = new Experimental.MerkleTree(height);
    }
    set(key, value) {
        super.set(key, value);
        this.merkleTree.setLeaf(key, value.getHash());
        return this;
    }
    get(key) {
        return super.get(key);
    }
    getWitness(key) {
        return this.merkleTree.getWitness(key);
    }
    getRoot() {
        return this.merkleTree.getRoot();
    }
}
