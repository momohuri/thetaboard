import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContractOfferReceivedModalComponent extends Component {
  get domainName() {
    return this.args.offer.domainName;
  }

  get offerAmount() {
    return this.args.offer.offer.offerAmount;
  }

  get ownerAddress() {
    return this.args.ownerAddress;
  }

  get acceptedOffer() {
    return this.args.acceptedOffer;
  }

  @action
  closeModal() {
    $('#offerReceivedModal').modal('hide');
  }
}
