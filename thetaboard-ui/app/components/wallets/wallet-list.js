import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WalletListComponent extends Component {
  @service('env-manager') envManager;
  @service('theta-sdk') thetaSdk;

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  get walletList() {
    return this.thetaSdk.wallets;
  }
}
