import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

export default class OfferService extends Service {
  constructor(...args) {
    super(...args);
    this.isConnectedWallet = false;
    this.offersReceived = [];
    this.offersMade = [];
    this.acceptedOffer = false;
    this.offer = {
      domain: '',
      offer: {
        offerAmount: 0,
      },
    };
    this.ownerAddress = '';
  }

  @tracked isConnectedWallet;
  @tracked offersReceived;
  @tracked offersMade;
  @tracked acceptedOffer;
  @tracked offer;
  @tracked ownerAddress;

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get contract() {
    return getOwner(this).lookup('service:contract');
  }

  @action
  async setupOffers(address) {
    if (address) {
      this.isConnectedWallet = true;
      this.offersMade = await this.contract.getOffersMade(address[0]);
      this.offersReceived = await this.contract.getOfferReceived(address[0]);
    }
    return address;
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
