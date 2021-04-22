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

  async connectToWallet() {
    const address = await this.thetaSdk.connectWallet();
    this.args.onRouteChange(address);
  }

  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    Ember.run.debounce(this, this.connectToWallet, 500, true);
  }
}
