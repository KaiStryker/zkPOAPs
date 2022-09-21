"use strict";
const { pinFileToIPFS } = require("./pinFileToIPFS.js");
const { pinJSONToIPFS } = require("./pinJSONtoIPFS.js");
const { metadata } = require("./metadata.js");
require('dotenv').config();
const gatherMetadata = async (filePath, description, name, nullifier) => {
    // Upload file to ipfs
    // Get file hash
    const tokenURI = await pinFileToIPFS(process.env.PINATAAPIKEY, process.env.PINATASECRETAPIKEY, filePath);
    // Import hash into proper section in metadata
    // Prepare metadata for Pinata
    const tokenMetadata = metadata(description, tokenURI, name, nullifier);
    // Upload json to ifps 
    // Get json hash
    const metadataURI = await pinJSONToIPFS(process.env.PINATAAPIKEY, process.env.PINATASECRETAPIKEY, tokenMetadata);
    return metadataURI;
};
module.exports = { gatherMetadata };
