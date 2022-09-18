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
  // PublicKey,
  // UInt64,
  prop,
  Mina,
  method,
  PrivateKey,
  // AccountUpdate,
} from 'snarkyjs';

import { BytesLike, ethers, Signature } from "ethers";
import { generateURI, Metadata } from "./PinataAPI/pinToPinata"
import { MerkleTree } from 'snarkyjs/dist/node/lib/merkle_tree';

await isReady;

// const doProofs = true;

class MerkleWitness extends Experimental.MerkleWitness(8) {}

class Account extends CircuitValue {
  @prop publicKey: string;

  constructor(publicKey: string) {
    super(publicKey);
    this.publicKey = publicKey;
  }

  hash(): Field {
    return Poseidon.hash(this.toFields());
  }
}
// we need the initiate tree root in order to tell the contract about our off-chain storage
// let initialCommitment: Field = Field.zero;
// let initialIndex: bigint = 0n;

export class zkPOAP extends SmartContract {
  // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
  @state(Field) commitment = State<Field>();
  @state(Field) index = State<bigint>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init(initialCommitment: Field, initialIndex: bigint) {
    // Se puede romper si el nullifier es de distinta longitud al nullifier original
    this.commitment.set(initialCommitment);
    this.index.set(initialIndex);

    console.log("commitment:",this.commitment)
    console.log("index:", this.index)
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

    let nullifierHash = Poseidon.hash([Field(poapId).add(Field(index))])
    
    let leaf = Poseidon.hash([nullifierHash, Poseidon.hash([poapId, account.hash()])])

    // // we calculate the new Merkle Root, based on the account changes
    let newCommitment = path.calculateRoot(leaf);

    this.commitment.set(newCommitment);
    this.index.set(index + 1n)

    return nullifierHash;
  }
}

/////// set up environment \\\\\\\
// let Local = Mina.LocalBlockchain();
// Mina.setActiveInstance(Local);

// let initialBalance = 10_000_000_000;

// let feePayer = Local.testAccounts[0].privateKey;

// // the zkapp account
// let zkappKey = PrivateKey.random();
// let zkappAddress = zkappKey.toPublicKey();

// // this map serves as our off-chain in-memory storage
// // let Accounts: Map<string, Account> = new Map<string, Account>();

// let poapId = Field(Poseidon.hash([Field(235)]))

// // let bob = new Account(Local.testAccounts[0].publicKey);
// let bobETH = new Account("0xa91472f9186E841d4541De71328f4559AC1d216e")
// // let alice = new Account(Local.testAccounts[1].publicKey);
// let aliceETH = new Account("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
// // let charlie = new Account(Local.testAccounts[2].publicKey);
// let charlieETH = new Account("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
// // let olivia = new Account(Local.testAccounts[3].publicKey);
// let oliviaETH = new Account("0x90F79bf6EB2c4f870365E785982E1f101E93b906")

// let nullifierHash1 = Field(Poseidon.hash([Field(113)]))
// let nullifierHash2 = Field(Poseidon.hash([Field(123)]))
// let nullifierHash3 = Field(Poseidon.hash([Field(133)]))
// let nullifierHash4 = Field(Poseidon.hash([Field(143)]))

// let com1 = Poseidon.hash([nullifierHash1, Poseidon.hash([poapId, bobETH.hash()])])
// let com2 = Poseidon.hash([nullifierHash2, Poseidon.hash([poapId, aliceETH.hash()])])
// let com3 = Poseidon.hash([nullifierHash3, Poseidon.hash([poapId, charlieETH.hash()])])
// let com4 = Poseidon.hash([nullifierHash4, Poseidon.hash([poapId, oliviaETH.hash()])])

// // we now need "wrap" the Merkle tree around our off-chain storage
// // we initialize a new Merkle Tree with height 8
// const Tree = new Experimental.MerkleTree(8);

// Tree.setLeaf(0n, com1);
// Tree.setLeaf(1n, com2);
// Tree.setLeaf(2n, com3);
// Tree.setLeaf(3n, com4);

// // now that we got our accounts set up, we need the commitment to deploy our contract!
// let initialCommitment = Tree.getRoot();
// let initialIndex: bigint = 0n;

// let zkPOAPApp = new zkPOAP(zkappAddress);
// console.log('Deploying zkPOAPApp..');
// if (doProofs) {
//   await zkPOAP.compile();
// }
// let tx = await Mina.transaction(feePayer, () => {
//   AccountUpdate.fundNewAccount(feePayer, { initialBalance });
//   zkPOAPApp.deploy({ zkappKey });
//   zkPOAPApp.init(initialCommitment, initialIndex);
// });
// tx.send();
/////// set up environment \\\\\\\

export async function checkAttendance(
  digest: BytesLike, 
  signature: Signature, 
  tokenId: bigint, 
  poapId: bigint, 
  nullifierHash: string,
  zkPOAPApp: zkPOAP,
  Tree: MerkleTree,
  feePayer: PrivateKey,
  zkAppKey: PrivateKey,
  doProofs: boolean
) : Promise<boolean> {
  let ethAddress: Account = new Account(ethers.utils.recoverAddress(digest, signature))
  let w = Tree.getWitness(tokenId);
  let witness = new MerkleWitness(w);

  let tx = await Mina.transaction(feePayer, () => {
    zkPOAPApp.proveAttendance(Field(nullifierHash), Field(poapId), ethAddress, witness);
    if (!doProofs) zkPOAPApp.sign(zkAppKey);
  });

  if (doProofs) {
    await tx.prove();
  }
  tx.send();
  return true;
}

export async function updateMerkle(
  digest: BytesLike, 
  signature: Signature, 
  poapId: bigint, 
  zkPOAPApp: zkPOAP,
  Tree: MerkleTree,
  feePayer: PrivateKey,
  zkAppKey: PrivateKey,
  doProofs: boolean
) : Promise<[Field, string]> {
  let ethAddress: Account = new Account(ethers.utils.recoverAddress(digest, signature))

  let index = zkPOAPApp.index.get()

  let w = Tree.getWitness(index);
  let witness = new MerkleWitness(w);
  let nullifier_: Field = Poseidon.hash([Field(poapId).add(Field(index))])

  let tx = await Mina.transaction(feePayer, () => {
    zkPOAPApp.updateRoot(Field(poapId), ethAddress, witness);
    if (!doProofs) zkPOAPApp.sign(zkAppKey);
  });

  if (doProofs) {
    await tx.prove();
  }
  tx.send();

  // if the transaction was successful, we can update our off-chain storage as well
  let leaf = Poseidon.hash([nullifier_, Poseidon.hash([Field(poapId), ethAddress.hash()])])
  Tree.setLeaf(index, leaf);
  zkPOAPApp.commitment.get().assertEquals(Tree.getRoot());

  let zkPOAP: Metadata = {
    filePath: process.env.filePath!,
    description: process.env.description!,
    name: process.env.name!,
    nullifier: nullifier_.toString()
  }
  
  let tokenURI: string = await generateURI(zkPOAP)
  return [nullifier_, tokenURI]
}