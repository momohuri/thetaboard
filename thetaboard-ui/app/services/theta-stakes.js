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
      if (!sendTransaction.success) this.utils.errorNotify(sendTransaction.msg);
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }

  @action
  async withdraw() {
    try {
      return await this.thetaSdk.sendThetaTransaction('withdraw');
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }
}
