var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { zkPOAP } from "./merkletree";
import { isReady, Poseidon, Field, Experimental, Permissions, CircuitValue, 
// PublicKey,
prop, Mina, PrivateKey, AccountUpdate, } from 'snarkyjs';
await isReady;
const doProofs = true;
class Account extends CircuitValue {
    publicKey;
    constructor(publicKey) {
        super(publicKey);
        this.publicKey = publicKey;
    }
    hash() {
        return Poseidon.hash(this.toFields());
    }
}
__decorate([
    prop,
    __metadata("design:type", String)
], Account.prototype, "publicKey", void 0);
export async function deploy(zkAppInstance, zkAppPrivateKey, account, initialCommitment, initialIndex) {
    let tx = await Mina.transaction(account, () => {
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
        zkAppInstance.setPermissions({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
        zkAppInstance.init(initialCommitment, initialIndex);
    });
    await tx.send().wait();
    return zkAppInstance;
}
export function createLocalBlockchain() {
    let Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const account = Local.testAccounts[0].privateKey;
    return account;
}
/////// set up environment \\\\\\\
export async function createEnvironment() {
    let Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    let initialBalance = 10000000000;
    let feePayer = Local.testAccounts[0].privateKey;
    // the zkapp account
    let zkappKey = PrivateKey.random();
    let zkAppAddress = zkappKey.toPublicKey();
    // this map serves as our off-chain in-memory storage
    // let Accounts: Map<string, Account> = new Map<string, Account>();
    let poapId = Field(Poseidon.hash([Field(235)]));
    // let bob = new Account(Local.testAccounts[0].publicKey);
    let bobETH = new Account("0xa91472f9186E841d4541De71328f4559AC1d216e");
    // let alice = new Account(Local.testAccounts[1].publicKey);
    let aliceETH = new Account("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    // let charlie = new Account(Local.testAccounts[2].publicKey);
    let charlieETH = new Account("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
    // let olivia = new Account(Local.testAccounts[3].publicKey);
    let oliviaETH = new Account("0x90F79bf6EB2c4f870365E785982E1f101E93b906");
    let nullifierHash1 = Field(Poseidon.hash([Field(113)]));
    let nullifierHash2 = Field(Poseidon.hash([Field(123)]));
    let nullifierHash3 = Field(Poseidon.hash([Field(133)]));
    let nullifierHash4 = Field(Poseidon.hash([Field(143)]));
    let com1 = Poseidon.hash([nullifierHash1, Poseidon.hash([poapId, bobETH.hash()])]);
    let com2 = Poseidon.hash([nullifierHash2, Poseidon.hash([poapId, aliceETH.hash()])]);
    let com3 = Poseidon.hash([nullifierHash3, Poseidon.hash([poapId, charlieETH.hash()])]);
    let com4 = Poseidon.hash([nullifierHash4, Poseidon.hash([poapId, oliviaETH.hash()])]);
    // we now need "wrap" the Merkle tree around our off-chain storage
    // we initialize a new Merkle Tree with height 8
    const Tree = new Experimental.MerkleTree(8);
    Tree.setLeaf(0n, com1);
    Tree.setLeaf(1n, com2);
    Tree.setLeaf(2n, com3);
    Tree.setLeaf(3n, com4);
    // now that we got our accounts set up, we need the commitment to deploy our contract!
    let initialCommitment = Tree.getRoot();
    let initialIndex = 0n;
    let zkPOAPApp = new zkPOAP(zkAppAddress);
    console.log('Deploying zkPOAPApp..');
    if (doProofs) {
        await zkPOAP.compile();
    }
    let tx = await Mina.transaction(feePayer, () => {
        AccountUpdate.fundNewAccount(feePayer, { initialBalance });
        zkPOAPApp.deploy({ zkappKey });
        zkPOAPApp.init(initialCommitment, initialIndex);
    });
    tx.send();
    return [zkPOAPApp, feePayer, Tree, zkappKey];
}
