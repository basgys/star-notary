const Set = artifacts.require('./Set.sol');
const StarNotary = artifacts.require("./StarNotary.sol");

module.exports = function (deployer) {
  deployer.deploy(Set);
  deployer.link(Set, StarNotary);
  deployer.deploy(StarNotary);
};
