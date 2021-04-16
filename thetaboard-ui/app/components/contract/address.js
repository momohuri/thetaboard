import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContractAddressComponent extends Component {
  @service('contract') contract;
  @service('theta-sdk') thetaSdk;

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
