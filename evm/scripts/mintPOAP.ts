import { ethers } from "hardhat";
import { Signer } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const zkPOAP: string = process.env.zkPOAP!

const mint = async (
    nullifier: string,
    recipient: string,
    tokenURI: string,
    signer: Signer
) => { 

    const registry = await ethers.getContractAt("zkPOAPs", zkPOAP, signer)
    const tx = await registry.mintPOAP(nullifier, recipient, tokenURI);

    console.log(`txHash: ${tx.hash}`)
    const receipt = await tx.wait()
    console.log(receipt)
    
    return receipt;
}

export { mint }