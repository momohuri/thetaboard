import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ContractOffersComponent extends Component {
  @service('theta-sdk') thetaSdk;
  @service('contract') contract;

  @tracked isConnectedWallet = false;
  @tracked offersReceived;
  @tracked offersMade;
  @tracked acceptedOffer = false;
  @tracked offer = {
    domain: '',
    offer: {
      offerAmount: 0,
    }
  };
  @tracked ownerAddress = '';

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

  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    const address = await this.thetaSdk.getThetaAccount();
    if (address) {
      this.isConnectedWallet = true;
      this.offersMade = await this.contract.getOffersMade(address[0]);
      this.offersReceived = await this.contract.getOfferReceived(address[0]);
    }
  }

  @action
  async cancelOffer(offer) {
    const canceledOffer = await this.contract.cancelOffer(offer);
    if (canceledOffer && canceledOffer.hash) {
      this.offer = offer;
      $('#offerCanceledModal').modal('show');
    }
  }

  @action
  async acceptOffer(offerReceived) {
    const offer = {
      domainName: offerReceived.domainName,
      offer: offerReceived.offers[0],
    };
    this.acceptedOffer = true;
    const acceptedOffer = await this.contract.acceptOffer(offer);
    if (acceptedOffer && acceptedOffer.hash) {
      this.offer = acceptedOffer.offer;
      this.ownerAddress = acceptedOffer.ownerAddr;
      $('#offerReceivedModal').modal('show');
    }
  }

  @action
  async rejectOffer(offerReceived) {
    const offer = {
      domainName: offerReceived.domainName,
      offer: offerReceived.offers[0],
    };
    this.acceptedOffer = false;
    const rejectedOffer = await this.contract.rejectOffer(offer);
    if (rejectedOffer && rejectedOffer.hash) {
      this.offer = rejectedOffer.offer;
      this.ownerAddress = rejectedOffer.ownerAddr;
      $('#offerReceivedModal').modal('show');
    }
  }
}
