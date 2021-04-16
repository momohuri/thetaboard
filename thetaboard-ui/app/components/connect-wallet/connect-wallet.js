import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ConnectWalletConnectWalletComponent extends Component {
  @service('theta-sdk') thetaSdk;
  @service('contract') contract;

  get walletLabel() {
    if (this.contract.domainName) {
      return `${this.contract.domainName}: ${this.thetaSdk.currentAccount}`;
    } else {
      return this.thetaSdk.currentAccount;
    }
  }

  async getWalletInfo() {
    const account = await this.thetaSdk.getThetaAccount();
    const walletInfo = await this.thetaSdk.getWalletInfo(account);
    $('button.connect-wallet-button').removeClass("disabled");
    this.contract.domainName
      ? this.args.onRouteChange(this.contract.domainName)
      : this.args.onRouteChange(account[0]);
    return walletInfo;
  }

  @action
  async connectWallet() {
    $('button.connect-wallet-button').addClass("disabled");
    Ember.run.debounce(this, this.getWalletInfo, null, 500);
  }
}
