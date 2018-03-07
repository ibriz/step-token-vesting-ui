const throwUtils = require('./expectThrow.js');

const timeUtils = require('./timeUtils.js');

const BigNumber = web3.BigNumber

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const MintableToken = artifacts.require('MintableToken');

const StepVesting = artifacts.require('StepVesting');

const MyVesting = artifacts.require('MyVesting');

contract('StepVesting', function ([_, owner, beneficiary]) {

  const amount = new BigNumber(1000);


    it('cannot be released before cliff', async function () {

    this.token = await MintableToken.new({ from: owner });
    console.log('MintableToken :'+ this.token.address);
    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    this.vesting = await StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
      );

    await this.token.mint(this.vesting.address, amount, { from: owner });

    await this.vesting.release(this.token.address).should.be.rejectedWith('revert');


  });


  it('can be released after cliff', async function () {

    this.token = await MintableToken.new({ from: owner });

    this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
    this.cliffDuration = timeUtils.duration.days(30);
    this.cliffPercent = 20;
    this.stepVestingDuration = timeUtils.duration.days(30);
    this.stepVestingPercent = 10;
    this.numberOfPartitions = 8;

    this.vesting = await StepVesting.new(
      beneficiary,
      this.start,
      this.cliffDuration,
      this.cliffPercent ,
      this.stepVestingDuration,
      this.stepVestingPercent,
      this.numberOfPartitions,
      true
      );

    await timeUtils.increaseTimeTo(this.start + this.cliffDuration + timeUtils.duration.weeks(1));

    await this.token.mint(this.vesting.address, amount, { from: owner });

    await this.vesting.release(this.token.address).should.be.fulfilled;

  });

  it('should fail to deploy if % does not add upto 100%', async function () {

   this.token = await MintableToken.new({ from: owner });

   this.start = timeUtils.latestTime() + timeUtils.duration.minutes(1); // +1 minute so it starts after contract instantiation
   this.cliffDuration = timeUtils.duration.days(30);
   this.cliffPercent = 21;
   this.stepVestingDuration = timeUtils.duration.days(30);
   this.stepVestingPercent = 10;
   this.numberOfPartitions = 8;

    await throwUtils.expectThrow ( StepVesting.new(
     beneficiary,
     this.start,
     this.cliffDuration,
     this.cliffPercent ,
     this.stepVestingDuration,
     this.stepVestingPercent,
     this.numberOfPartitions,
     true
    ));
 });

});

