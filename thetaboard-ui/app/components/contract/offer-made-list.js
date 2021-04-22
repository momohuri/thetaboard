import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContractOfferMadeListComponent extends Component {
  @service('contract') contract;
  @service('offer') offer;

  @action
  connectWallet(event) {
    event.preventDefault();
    return this.args.connectWallet();
  }
}
