import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContractOffersComponent extends Component {
  @service('offer') offer;
  @service('theta-sdk') thetaSdk;

  @action
  setupOfferReceivedEventListener() {
    $('#offerReceivedModal').on('hidden.bs.modal', () => {
      this.connectWallet();
    });
  }

  @action
  setupOfferMadeEventListener() {
    $('#offerCanceledModal').on('hidden.bs.modal', () => {
      this.connectWallet();
    });
  }

  async connectToWallet() {
    const address = await this.thetaSdk.connectWallet();
    this.args.onRouteChange(address);
  }

  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    Ember.run.debounce(this, this.connectToWallet, 500, true);
  }
}
