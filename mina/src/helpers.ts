import { zkPOAP } from "./merkletree";

import {
  isReady,
  Poseidon,
  Field,
  Experimental,
  Permissions,
  CircuitValue,
  // PublicKey,
  prop,
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'snarkyjs';
import { MerkleTree } from "snarkyjs/dist/node/lib/merkle_tree";

await isReady;

const doProofs = true;

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

export async function deploy(
  zkAppInstance:zkPOAP, 
  zkAppPrivateKey: PrivateKey,
  account: PrivateKey,
  initialCommitment: Field,
  initialIndex: bigint
) : Promise<zkPOAP> {
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

export function createLocalBlockchain(): PrivateKey {
  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  const account = Local.testAccounts[0].privateKey;
  return account;
}


/////// set up environment \\\\\\\

export async function createEnvironment() : Promise<[zkPOAP, PrivateKey, MerkleTree]> {
  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  let initialBalance = 10_000_000_000;

  let feePayer = Local.testAccounts[0].privateKey;

  // the zkapp account
  let zkappKey = PrivateKey.random();
  let zkappAddress = zkappKey.toPublicKey();

  // this map serves as our off-chain in-memory storage
  // let Accounts: Map<string, Account> = new Map<string, Account>();

  let poapId = Field(Poseidon.hash([Field(235)]))

  // let bob = new Account(Local.testAccounts[0].publicKey);
  let bobETH = new Account("0xa91472f9186E841d4541De71328f4559AC1d216e")
  // let alice = new Account(Local.testAccounts[1].publicKey);
  let aliceETH = new Account("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
  // let charlie = new Account(Local.testAccounts[2].publicKey);
  let charlieETH = new Account("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
  // let olivia = new Account(Local.testAccounts[3].publicKey);
  let oliviaETH = new Account("0x90F79bf6EB2c4f870365E785982E1f101E93b906")

  let nullifierHash1 = Field(Poseidon.hash([Field(113)]))
  let nullifierHash2 = Field(Poseidon.hash([Field(123)]))
  let nullifierHash3 = Field(Poseidon.hash([Field(133)]))
  let nullifierHash4 = Field(Poseidon.hash([Field(143)]))

  let com1 = Poseidon.hash([nullifierHash1, Poseidon.hash([poapId, bobETH.hash()])])
  let com2 = Poseidon.hash([nullifierHash2, Poseidon.hash([poapId, aliceETH.hash()])])
  let com3 = Poseidon.hash([nullifierHash3, Poseidon.hash([poapId, charlieETH.hash()])])
  let com4 = Poseidon.hash([nullifierHash4, Poseidon.hash([poapId, oliviaETH.hash()])])

  // we now need "wrap" the Merkle tree around our off-chain storage
  // we initialize a new Merkle Tree with height 8
  const Tree = new Experimental.MerkleTree(8);

  Tree.setLeaf(0n, com1);
  Tree.setLeaf(1n, com2);
  Tree.setLeaf(2n, com3);
  Tree.setLeaf(3n, com4);

  // now that we got our accounts set up, we need the commitment to deploy our contract!
  let initialCommitment = Tree.getRoot();
  let initialIndex: bigint = 0n;

  let zkPOAPApp = new zkPOAP(zkappAddress);
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

  return [zkPOAPApp, feePayer, Tree]
}
