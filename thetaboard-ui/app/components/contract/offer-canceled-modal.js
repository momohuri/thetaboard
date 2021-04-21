import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContractOfferCanceledModalComponent extends Component {
  get domainName() {
    return this.args.offer.domainName;
  }

  get offerAmount() {
    return this.args.offer.offer.offerAmount;
  }

  @action
  closeModal() {
    $('#offerCanceledModal').modal('hide');
  }
}
