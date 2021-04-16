import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ContractDomainAssignedModalComponent extends Component {
  get domainName() {
    return this.args.domainName;
  }

  get walletAddressReceiver() {
    return this.args.walletAddressReceiver;
  }

  @action
  closeModal() {
    $('#domainModal').modal('hide');
  }
}
