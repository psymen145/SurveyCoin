const SYC = artifacts.require("SurveyCoin.sol");

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(SYC, "Survey Coin", "SYC");
  const surveycoin = await SYC.deployed();

}