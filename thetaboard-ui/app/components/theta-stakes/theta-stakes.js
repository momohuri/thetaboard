import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ThetaStakesComponent extends Component {
  constructor(...args) {
    super(...args);
  }
  @tracked stakeAmount = 0;
  @tracked isStakes = true;
  @tracked isDeposit = false;
  @tracked isWithdraw = false;

  @action
  showDeposit() {
    this.isStakes = false;
    this.isDeposit = true;
    this.isWithdraw = false;
    return 'toto';
  }

  @action
  showWithdraw() {
    this.isStakes = false;
    this.isDeposit = false;
    this.isWithdraw = true;
    return 'toto';
  }

  @action
  showStakes() {
    this.stakeAmount = 0;
    this.isStakes = true;
    this.isDeposit = false;
    this.isWithdraw = false;
    return 'toto';
  }
}
