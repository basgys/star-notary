// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.2;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "./Set.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    Set.set sales;

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    constructor() public ERC721("StarNotary", "SNY") {}

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        require(bytes(_name).length > 0, "A star name must be present");

        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    function getStars(address _owner) public view returns (uint256[] memory) {
        // TODO: Paginate when balance can become too high
        uint256 balance = balanceOf(_owner);
        uint256[] memory stars = new uint[](balance);
        for (uint8 i = 0; i < balance; i++) {
            stars[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return stars;
    }

    function getSales() public view returns (uint256[] memory) {
        uint256[] memory stars = new uint256[](sales.size);
        uint256 i = 0;
        for (uint saleIndex = Set.itStart(sales); Set.itValid(sales, saleIndex); saleIndex = Set.itNext(sales, saleIndex)) {
            (uint256 tokenId,) = Set.itGet(sales, saleIndex);
            stars[i] = tokenId;
            i++;
        }
        return stars;
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale stars you don't own");
        require(_price > 0, "You can't sale a star for free");
        require(!Set.contains(sales, _tokenId), "You can't put up a star for sale twice");

        Set.insert(sales, _tokenId, _price);
    }

    function buyStar(uint256 _tokenId) public payable {
        uint256 starCost = Set.get(sales, _tokenId);
        require(starCost > 0, "The Star should be up for sale");

        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        _transfer(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or _removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        Set.remove(sales, _tokenId);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory name, address owner, bool onSale, uint256 price) {
        Star memory star = tokenIdToStarInfo[_tokenId];
        uint256 starCost = Set.get(sales, _tokenId);
        return (star.name, ownerOf(_tokenId), starCost > 0, starCost);
    }

    // approveExchange allows a star to be exchanged
    function approveExchange(address _to, uint256 _tokenId) public {
        require(!Set.contains(sales, _tokenId), "The Star is already up for sale");

        approve(_to, _tokenId);
    }

    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        if (_tokenId1 == _tokenId2) return;

        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);
        require(msg.sender == owner1 || msg.sender == owner2, "One of the tokens must belong to the sender");
        require(msg.sender == getApproved(_tokenId1) || msg.sender == getApproved(_tokenId2), "One of the tokens must be approved for tranfer");

        safeTransferFrom(owner1, owner2, _tokenId1);
        safeTransferFrom(owner2, owner1, _tokenId2);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _to, _tokenId);
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

}
