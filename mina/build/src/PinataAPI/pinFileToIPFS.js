"use strict";
//imports needed for this function
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey, filePath) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append('file', fs.createReadStream(`${filePath}`));
    // //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    // //metadata is optional
    // const metadata = JSON.stringify({
    //     name: 'testname',
    //     keyvalues: {
    //         exampleKey: 'exampleValue'
    //     }
    // });
    // data.append('pinataMetadata', metadata);
    return axios
        .post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
        }
    })
        .then((response) => {
        const ipfsHeader = 'ipfs://';
        const ipfsURI = ipfsHeader.concat(response.data.IpfsHash.toString());
        return ipfsURI;
    })
        .catch((error) => {
        console.error(error);
    });
};
module.exports = { pinFileToIPFS };
