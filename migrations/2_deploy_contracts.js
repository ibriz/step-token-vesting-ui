const StepVesting = artifacts.require("./StepVesting.sol")
const SimpleToken = artifacts.require("SimpleToken")

module.exports = function(deployer) {
  const beneficiary = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"

  const start = Math.floor(Date.now()/1000)
  const cliff = 400 // ~1 yr
  const duration = 3600 // ~4yrs
  const amount = 1000 * 1e18


  const cliffPercent = 20;
  const numberOfPartitions = 8;
  const stepVestingDuration = 30 * 24 * 60 * 60;
  const stepVestingPercent = 10;

//(address _beneficiary, uint256 _start, uint256 _cliff, uint256 _cliffPercent, uint256 _stepVestingPercent,uint256 _numberOfPartitions, uint256 _stepVestingDuration, bool _revocable)
  deployer.deploy(StepVesting, beneficiary, start, cliff, cliffPercent,stepVestingPercent,numberOfPartitions,stepVestingDuration,duration, true).then(() => {
  //deployer.deploy(StepVesting, beneficiary, start, cliff, cliffPercent,stepVestingPercent, numberOfPartitions,stepVestingDuration,true).then(() => {
    return deployer.deploy(SimpleToken)
  }).then(() => {
    const simpleToken = SimpleToken.at(SimpleToken.address);
    console.log('StepVesting.address :' + StepVesting.address);
    simpleToken.transfer(StepVesting.address, amount);
  })
}