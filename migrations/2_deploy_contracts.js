var Resumeum = artifacts.require("./Resumeum.sol");

module.exports = function(deployer) {
  deployer.deploy(Resumeum, 20000000000000000);
};
