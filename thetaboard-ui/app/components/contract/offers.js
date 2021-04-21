import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContractOffersComponent extends Component {
  @service('offer') offer;

  @action
  setupOfferReceivedEventListener() {
    $('#offerReceivedModal').on('hidden.bs.modal', () => {
      this.offer.connectWallet();
    });
  }

  @action
  setupOfferMadeEventListener() {
    $('#offerCanceledModal').on('hidden.bs.modal', () => {
      this.offer.connectWallet();
    });
  }
}
