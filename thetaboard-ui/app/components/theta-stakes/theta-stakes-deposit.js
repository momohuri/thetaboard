import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ThetaStakesThetaStakesDepositComponent extends Component {
  @service('theta-stakes') thetaStakes;
  @service('guardian') guardian;
}
