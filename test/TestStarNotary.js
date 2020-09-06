const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const info = await instance.lookUptokenIdToStarInfo(starId);
    const onSale = info[2];
    const price = info[3];
    assert.equal(onSale, true);
    assert.equal(price, starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    const expectName = "alpha";
    const starId = 6;
    await instance.createStar(expectName, starId, {from: user1});
    const info = await instance.lookUptokenIdToStarInfo(starId);
    const name = info[0];
    const owner = info[1];
    const onSale = info[2];
    const price = info[3];

    assert.equal(expectName, name);
    assert.equal(user1, owner);
    assert.equal(false, onSale);
    assert.equal(0, price);
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];

    await instance.createStar('star one', 71, {from: user1});
    await instance.createStar('star two', 72, {from: user2});

    // Approve exchange of star two to user 1
    await instance.approveExchange(user1, 72, {from: user2});

    // Exchange stars
    await instance.exchangeStars(71, 72, {from: user1});

    const infoOne = await instance.lookUptokenIdToStarInfo(71);
    assert.equal(infoOne[1], user2, "Star 1 should belong to user 2");

    const infoTwo = await instance.lookUptokenIdToStarInfo(72);
    assert.equal(infoTwo[1], user1, "Star 2 should belong to user 1");
});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];

    await instance.createStar('star one', 81, {from: user1});
    await instance.transferStar(user2, 81, {from: user1});

    const info = await instance.lookUptokenIdToStarInfo(81);
    assert.equal(info[1], user2, "Star should belong to user 2 after transfer");
});

it('lookUptokenIdToStarInfo test', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];

    const expectName = 'star one';
    const expectId = 91;
    await instance.createStar(expectName, expectId, {from: user1});

    const info = await instance.lookUptokenIdToStarInfo(91);
    assert.equal(info[0], expectName);
    assert.equal(info[1], user1);
    assert.equal(info[2], false); // on Sale
    assert.equal(info[3], 0); // price
});