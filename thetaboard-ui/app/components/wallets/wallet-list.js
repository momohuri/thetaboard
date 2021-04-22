import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class WalletListComponent extends Component {
  @service('env-manager') envManager;
  @service('theta-sdk') thetaSdk;

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  get walletList() {
    return this.thetaSdk.wallets;
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
