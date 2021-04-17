import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ThetaStakesConfirmationModalComponent extends Component {
  @service('theta-stakes') thetaStakes;
  @service('guardian') guardian;

  get isDeposit() {
    return this.thetaStakes.isDeposit;
  }

  @action
  closeModal() {
    $('#stakesModal').modal('hide');
  }
}
