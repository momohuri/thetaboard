import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchBarSearchBarComponent extends Component {
  @service('theta-sdk') thetaSdk;
  @service('utils') utils;
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
    } else {
      this.utils.errorNotify('Invalid Wallet Address');
    }
    $('#searchModal').modal('hide');
  }
}
