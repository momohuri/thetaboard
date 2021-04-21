import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ConnectWalletConnectWalletComponent extends Component {
  @service('theta-sdk') thetaSdk;
  @service('contract') contract;
  @service('offer') offer;

  get walletLabel() {
    if (this.contract.domainName) {
      return `${this.contract.domainName}: ${this.thetaSdk.currentAccount}`;
    } else {
      return this.thetaSdk.currentAccount;
    }
  }

  async getWalletInfo() {
    // const address = await this.thetaSdk.connectWallet();
    const address = await this.offer.connectWallet();
    this.args.onRouteChange(address);
    $('button.connect-wallet-button').removeClass("disabled");
  }

  @action
  async connectWallet() {
    $('button.connect-wallet-button').addClass("disabled");
    Ember.run.debounce(this, this.getWalletInfo, null, 500);
  }
}
