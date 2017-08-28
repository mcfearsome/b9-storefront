var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var StoreFront = artifacts.require("./StoreFront.sol");

module.exports = function(deployer) {
  deployer.deploy(StoreFront);
};
