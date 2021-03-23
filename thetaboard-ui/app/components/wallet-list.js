import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WalletListComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @service('env-manager') envManager;

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  get walletList() {
    let { wallets } = this.args;
    return wallets;
  }
}
