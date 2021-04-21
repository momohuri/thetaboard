import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContractOfferMadeListComponent extends Component {
  @service('contract') contract;

  get isConnectedWallet() {
    return this.args.isConnectedWallet;
  }

  get offersMade() {
    return this.args.offersMade;
  }

  @action
  connectWallet(event) {
    event.preventDefault();
    return this.args.connectWallet();
  }

  @action
  async cancelOffer(offer) {
    return await this.args.cancelOffer(offer);
  }
}
