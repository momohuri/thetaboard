import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

export default class OfferService extends Service {
  @tracked isConnectedWallet = false;
  @tracked offersReceived;
  @tracked offersMade;
  @tracked acceptedOffer = false;
  @tracked offer = {
    domain: '',
    offer: {
      offerAmount: 0,
    },
  };
  @tracked ownerAddress = '';

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get contract() {
    return getOwner(this).lookup('service:contract');
  }


  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    $('.connect-wallet-offer-button').addClass("disabled");
    Ember.run.debounce(this, this.connectToWallet, null, 500);
  }

  @action
  async connectToWallet() {
    const address = await this.thetaSdk.getThetaAccount();
    await this.thetaSdk.getWalletInfo(address);
    if (address) {
      this.isConnectedWallet = true;
      this.offersMade = await this.contract.getOffersMade(address[0]);
      this.offersReceived = await this.contract.getOfferReceived(address[0]);
    }
    $('.connect-wallet-offer-button').removeClass("disabled");
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
