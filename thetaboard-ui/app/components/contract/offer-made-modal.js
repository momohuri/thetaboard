import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContractOfferMadeModalComponent extends Component {
  get domainName() {
    return this.args.domainName;
  }

  get offerAmount() {
    return this.args.offerAmount;
  }

  get ownerAddress() {
    return this.args.ownerAddress;
  }

  @action
  closeModal() {
    $('#offerMadeModal').modal('hide');
  }
}
