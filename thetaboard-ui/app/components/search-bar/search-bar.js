import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchBarSearchBarComponent extends Component {
  @service('theta-sdk') thetaSdk;
  @service('utils') utils;
  @service('contract') contract;
  walletAddress = '';

  @action
  setupEventListener() {
    $('#searchModal').on('shown.bs.modal', () => {
      $('#searchInput').focus();
    });
    $('#searchModal').on('hidden.bs.modal', () => {
      $('#searchInput').blur();
    });
  }

  @action 
  async search(event) {
    event.preventDefault();
    if (
      this.walletAddress.length == 42 &&
      this.walletAddress.substr(1, 1).toLocaleLowerCase() == 'x'
    ) {
      await this.thetaSdk.getWalletInfo([this.walletAddress]);
      this.contract.domainName
        ? this.args.onRouteChange(this.contract.domainName)
        : this.args.onRouteChange(this.walletAddress);
    } else {
      // const nameToAddress = await this.contract.getNameToAddress(
      //   this.walletAddress
      // );
      // if (
      //   nameToAddress.length &&
      //   nameToAddress['ownerAddr'] !=
      //     '0x0000000000000000000000000000000000000000'
      // ) {
      //   await this.thetaSdk.getWalletInfo([nameToAddress['ownerAddr']]);
      //   this.args.onRouteChange(this.walletAddress);
      // } else {
      //   this.utils.errorNotify('Invalid Wallet Address or Domain name');
      //   this.args.onRouteChange('');
      //   this.contract.domainName = '';
      // }


      this.utils.errorNotify('Invalid Wallet Address');
      this.args.onRouteChange('');
      this.contract.domainName = '';

    }
    $('#searchModal').modal('hide');
  }
}
