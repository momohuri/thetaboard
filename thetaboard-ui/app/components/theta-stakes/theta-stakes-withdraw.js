import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ThetaStakesThetaStakesWithdrawComponent extends Component {
  @service('theta-stakes') thetaStakes;
}
