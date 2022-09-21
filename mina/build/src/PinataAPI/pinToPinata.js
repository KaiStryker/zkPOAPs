const { gatherMetadata } = require('./gatherMetadata.js');
const generateURI = async (NFT) => {
    const metadataURI = await gatherMetadata(NFT.filePath, NFT.description, NFT.name, NFT.nullifier);
    console.log(`Metadata: ${metadataURI}`);
    return metadataURI;
};
export { generateURI };
