import { zkPOAP } from "./merkletree";

import {
  Permissions,
  PrivateKey,
  Mina,
  Field,
} from 'snarkyjs';

export async function deploy(
  zkAppInstance:zkPOAP, 
  zkAppPrivateKey: PrivateKey,
  account: PrivateKey,
  initialCommitment: Field,
  initialIndex: bigint
) {
  let tx = await Mina.transaction(account, () => {
    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    zkAppInstance.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    zkAppInstance.init(initialCommitment, initialIndex);
  });
  await tx.send().wait();
}

export function createLocalBlockchain(): PrivateKey {
  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  const account = Local.testAccounts[0].privateKey;
  return account;
}
