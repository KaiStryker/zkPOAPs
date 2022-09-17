/*
Description: 
This example describes how developers can use Merkle Trees as a basic off-chain storage tool.
zkApps on Mina can only store a small amount of data on-chain, but many use cases require your application to at least reference big amounts of data.
Merkle Trees give developers the power of storing large amounts of data off-chain, but proving its integrity to the on-chain smart contract!
! Unfamiliar with Merkle Trees? No problem! Check out https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/
*/

import {
  SmartContract,
  isReady,
  Poseidon,
  Field,
  Experimental,
  Permissions,
  DeployArgs,
  State,
  state,
  CircuitValue,
  PublicKey,
  UInt64,
  prop,
  Mina,
  method,
  PrivateKey,
  AccountUpdate,
} from 'snarkyjs';

import { BytesLike, ethers, Signature } from "ethers";

await isReady;

const doProofs = true;

class MerkleWitness extends Experimental.MerkleWitness(8) {}

class Account extends CircuitValue {
  @prop publicKey: PublicKey;

  constructor(publicKey: PublicKey) {
    super(publicKey);
    this.publicKey = publicKey;
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
// we need the initiate tree root in order to tell the contract about our off-chain storage
let initialCommitment: Field = Field.zero;

class zkPOAP extends SmartContract {
  // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
  @state(Field) commitment = State<Field>();
  @state(Field) index = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    this.balance.addInPlace(UInt64.fromNumber(initialBalance));
    this.commitment.set(initialCommitment);
  }

  @method
  proveAttendance(nullifierHash: Field, poapId: Field, account: Account, path: MerkleWitness) {
    // we fetch the on-chain commitment
    let commitment = this.commitment.get();
    this.commitment.assertEquals(commitment);

    let leaf = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, account.hash()])])

    // we check that the account is within the committed Merkle Tree
    path.calculateRoot(leaf).assertEquals(commitment);

    // // we calculate the new Merkle Root, based on the account changes
    // let newCommitment = path.calculateRoot(newAccount.hash());
    return true;
    // this.commitment.set(newCommitment);
  }

  @method
  updateRoot(poapId: Field, account: Account, path: MerkleWitness) {
    // we fetch the on-chain commitment
    let commitment = this.commitment.get();
    this.commitment.assertEquals(commitment);

    path.calculateRoot(Field(0)).assertEquals(commitment)

    let index = this.index.get();
    this.index.assertEquals(index);

    let nullifierHash = Poseidon.hash([Field(poapId).add(index)])
    
    let leaf = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, account.hash()])])

    // // we calculate the new Merkle Root, based on the account changes
    let newCommitment = path.calculateRoot(leaf);

    this.commitment.set(newCommitment);
    this.index.set(index.add(1))

    return nullifierHash;
  }
}

type Names = 'Bob' | 'Alice' | 'Charlie' | 'Olivia';

let Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
let initialBalance = 10_000_000_000;

let feePayer = Local.testAccounts[0].privateKey;

// the zkapp account
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();

// this map serves as our off-chain in-memory storage
// let Accounts: Map<string, Account> = new Map<Names, Account>();

let poapId = Field(Poseidon.hash([Field(235)]))
let nullifierHash = Field(Poseidon.hash([Field(123)]))

// let bob = new Account(Local.testAccounts[0].publicKey);
// let alice = new Account(Local.testAccounts[1].publicKey);
// let charlie = new Account(Local.testAccounts[2].publicKey);
// let olivia = new Account(Local.testAccounts[3].publicKey);

let com1 = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, bob.hash()])])
let com2 = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, alice.hash()])])
let com3 = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, charlie.hash()])])
let com4 = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, olivia.hash()])])

// Accounts.set('Bob', bob);
// Accounts.set('Alice', alice);
// Accounts.set('Charlie', charlie);
// Accounts.set('Olivia', olivia);

// we now need "wrap" the Merkle tree around our off-chain storage
// we initialize a new Merkle Tree with height 8
const Tree = new Experimental.MerkleTree(8);

Tree.setLeaf(0n, com1);
Tree.setLeaf(1n, com2);
Tree.setLeaf(2n, com3);
Tree.setLeaf(3n, com4);

// now that we got our accounts set up, we need the commitment to deploy our contract!
initialCommitment = Tree.getRoot();

let zkPOAPApp = new zkPOAP(zkappAddress);
console.log('Deploying zkPOAPApp..');
if (doProofs) {
  await zkPOAP.compile();
}
let tx = await Mina.transaction(feePayer, () => {
  AccountUpdate.fundNewAccount(feePayer, { initialBalance });
  zkPOAPApp.deploy({ zkappKey });
});
tx.send();

async function checkAttendance(
  digest: BytesLike, 
  signature: Signature, 
  tokenId: bigint, 
  poapId: bigint, 
  nullifierHash: string,
) {
  let ethaddress = ethers.utils.recoverAddress(digest, signature)
  
  let account = Accounts.get(ethaddress)!;
  let w = Tree.getWitness(tokenId);
  let witness = new MerkleWitness(w);

  let tx = await Mina.transaction(feePayer, () => {
    zkPOAPApp.proveAttendance(Field(nullifierHash), Field(poapId), account, witness);
    if (!doProofs) zkPOAPApp.sign(zkappKey);
  });

  if (doProofs) {
    await tx.prove();
  }
  tx.send();
}

async function updateMerkle(
  digest: BytesLike, 
  signature: Signature, 
  poapId: bigint, 
) {
  let ethaddress = ethers.utils.recoverAddress(digest, signature)
  let account = Accounts.get(ethaddress)!;

  let index = zkPOAPApp.index.get().toBigInt()

  let w = Tree.getWitness(index);
  let witness = new MerkleWitness(w);
  let nullifier: Field = Poseidon.hash([Field(poapId).add(Field(index))])

  let tx = await Mina.transaction(feePayer, () => {
    zkPOAPApp.updateRoot(Field(poapId), account, witness);
    if (!doProofs) zkPOAPApp.sign(zkappKey);
  });

  if (doProofs) {
    await tx.prove();
  }
  tx.send();

  // if the transaction was successful, we can update our off-chain storage as well
  let leaf = Poseidon.hash([nullifier, Poseidon.hash([Field(poapId), account.hash()])])
  Tree.setLeaf(index, leaf);
  zkPOAPApp.commitment.get().assertEquals(Tree.getRoot());
}

export { checkAttendance, updateMerkle };