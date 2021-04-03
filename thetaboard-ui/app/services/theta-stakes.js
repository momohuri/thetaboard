import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import { utils } from '@thetalabs/theta-js';

export default class ThetaStakesService extends Service {
  constructor(...args) {
    super(...args);
  }

  @tracked stakeAmount = 0;
  @tracked isStakes = true;
  @tracked isDeposit = false;
  @tracked isWithdraw = false;

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  @action
  showDeposit() {
    this.isStakes = false;
    this.isDeposit = true;
    this.isWithdraw = false;
  }

  @action
  showWithdraw() {
    this.isStakes = false;
    this.isDeposit = false;
    this.isWithdraw = true;
  }

  @action
  showStakes() {
    this.stakeAmount = 0;
    this.isStakes = true;
    this.isDeposit = false;
    this.isWithdraw = false;
  }

  @action
  async deposit() {
    try {
      const sendTransaction = await this.thetaSdk.sendThetaTransaction('deposit');
      if (sendTransaction.hash) {
        this.utils.successNotify('Deposit Successful!');
      } else {
        this.utils.errorNotify('Something went wrong, please try again');
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }

  @action
  async withdraw() {
    try {
      const withdraw = await this.thetaSdk.sendThetaTransaction('withdraw');
      if (withdraw.hash) {
        this.utils.successNotify('Withdraw Successful!');
      } else {
        this.utils.errorNotify('Something went wrong, please try again');
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }
}
