import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ContractOfferReceivedListComponent extends Component {
  @service('contract') contract;

  get isConnectedWallet() {
    return this.args.isConnectedWallet;
  }

  get offersReceived() {
    return this.args.offersReceived;
  }

  @action
  connectWallet(event) {
    event.preventDefault();
    return this.args.connectWallet();
  }

  @action
  acceptOffer(offer) {
    return this.args.acceptOffer(offer);
  }

  @action
  rejectOffer(offer) {
    return this.args.rejectOffer(offer);
  }
}
