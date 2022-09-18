const { gatherMetadata } = require('./gatherMetadata.js')

export interface Metadata {
    filePath: String,
    description: String,
    name: String,
    nullifier: String
}

const generateURI = async(NFT: Metadata) => {
    const metadataURI = await gatherMetadata(
        NFT.filePath,
        NFT.description,
        NFT.name,
        NFT.nullifier
    )

    console.log(`Metadata: ${metadataURI}`)
    return metadataURI
}


export { generateURI } 