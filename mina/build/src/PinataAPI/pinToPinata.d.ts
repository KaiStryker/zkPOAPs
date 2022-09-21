export interface Metadata {
    filePath: String;
    description: String;
    name: String;
    nullifier: String;
}
declare const generateURI: (NFT: Metadata) => Promise<any>;
export { generateURI };
