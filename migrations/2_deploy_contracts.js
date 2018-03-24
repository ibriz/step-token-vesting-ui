const StepVesting = artifacts.require("./StepVesting.sol")
const SimpleToken = artifacts.require("SimpleToken")
const OneTimeTokenVesting = artifacts.require("./OneTimeTokenVesting.sol");

module.exports = function(deployer) {
  //const beneficiary = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"

  const beneficiary = web3.eth.accounts[2];
  const beneficiary2nd = web3.eth.accounts[3];

  const start = web3.eth.getBlock('latest').timestamp + 60
  const cliffDuration = 90 // ~1 yr
  //const duration = 1050 // ~4yrs    (cliff + (stepVestingDuration * numberOfPartitions))
  const amount = 100 * 1e18


  const cliffPercent = 20;
  const numberOfPartitions = 8;
  //const stepVestingDuration = 30 * 24 * 60 * 60;
  const stepVestingDuration = 120;
  const stepVestingPercent = 10;

   //passing all these params for now as ethereum doesn't handle floating or fixed point very well right now
  deployer.deploy(StepVesting, beneficiary, start, cliffDuration, cliffPercent,stepVestingDuration,stepVestingPercent,numberOfPartitions, true)
   .then(() => {
    return deployer.deploy(SimpleToken)
  }).then(() => {
    const simpleToken = SimpleToken.at(SimpleToken.address);
    console.log('StepVesting.address :' + StepVesting.address);
    return simpleToken.transfer(StepVesting.address, amount);
  }).then( () => {
    console.log('beneficiary for OneTimeTokenVesting : ' + beneficiary2nd);
    return deployer.deploy(OneTimeTokenVesting, beneficiary2nd, start, 360, true);
  }).then( () => {
    console.log("OneTimeTokenVesting address : " + OneTimeTokenVesting.address);
  });
}
