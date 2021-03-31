import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ThetaStakesComponent extends Component {
  @service('theta-stakes') thetaStakes;
  @service('theta-sdk') thetaSDK;
}
