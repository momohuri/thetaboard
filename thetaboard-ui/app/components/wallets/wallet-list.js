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

  @action
  async connectWallet(event) {
    event.preventDefault();
    const account = await this.thetaSdk.getThetaAccount();
    const walletInfo = await this.thetaSdk.getWalletInfo(account);
    // this.contract.domainName
    //   ? this.args.onRouteChange(this.contract.domainName)
    //   : this.args.onRouteChange(account[0]);
    this.args.onRouteChange(account[0]);
    return walletInfo;
  }
}
