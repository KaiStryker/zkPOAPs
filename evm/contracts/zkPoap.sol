// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import '@openzeppelin/contracts/access/Ownable.sol';


contract zkPOAPs is Ownable, AccessControl, ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter internal _ids;

    event zkPOAP(bytes32 nullifier, uint256 tokenId);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Base token URI
    string private _baseURI_;

    // Last Used id (used to generate new ids)
    uint256 private lastId;

    // EventId for each token
    mapping(uint256 => bytes32) private _nullifierHash;
    // mapping(bytes32 => bool) private _nullifierHashUsed;
    mapping(uint256 => bool) tokenMinted;

    constructor(
        address admin,
        address minter,
        address pauser
    ) ERC721("zkPOAPs", "zkPOAPs") {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, minter);
        _setupRole(PAUSER_ROLE, pauser);
        _transferOwnership(admin);
    }

    function getNullifier(uint256 tokenId) public view returns (bytes32) {
        return _nullifierHash[tokenId];
    }

    // function tokenURI(uint256 tokenId) external view returns (string memory) {
    //     // uint eventId = _tokenEvent[tokenId];
    //     return _strConcat(_baseURI, _uint2str(eventId), "/", _uint2str(tokenId), "");
    // }

    function setBaseURI(string memory baseURI) public {
        _baseURI_ = baseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURI_;
    }

    /**
     * @dev Function to mint tokens
     * @param nullifierHash for the new token
     * @param recipient The address that will receive the minted tokens.
     * @return A boolean that indicates if the operation was successful.
     */
    function mintToken(bytes32 nullifierHash, address recipient, string memory tokenURI_)
    public returns(bool)
    {
        return _mintToken(nullifierHash, recipient, tokenURI_);
    }

    /**
     * @dev Burns a specific ERC721 token.
     * @param tokenId uint256 id of the ERC721 token to be burned.
     */
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId));
        _burn(tokenId);
        delete _nullifierHash[tokenId];
    }

    /**
     * @dev Function to mint tokens
     * @param nullifierHash for the new token
     * @param recipient The address that will receive the minted tokens.
     * @return A boolean that indicates if the operation was successful.
     */
    function _mintToken(bytes32 nullifierHash, address recipient, string memory tokenURI_) internal returns (bool) {
        uint256 nextId = _ids.current();
        _ids.increment();

        _nullifierHash[nextId] = nullifierHash;
        _mint(recipient, nextId);
        _setTokenURI(nextId, tokenURI_);

        emit zkPOAP(nullifierHash, nextId);
        return true;
    }


    function supportsInterface(
        bytes4 interfaceId
    ) 
        public view override(AccessControl, ERC721) 
        returns (bool) 
    {
        return interfaceId == type(IERC721).interfaceId
        || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address,
        uint256 tokenId
    ) internal override virtual {
        require(!tokenMinted[tokenId], "token cannot be transferred");
        if(from != address(0x0)) tokenMinted[tokenId] = true;
    }
}
