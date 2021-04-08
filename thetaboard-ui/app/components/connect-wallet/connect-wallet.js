import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ConnectWalletConnectWalletComponent extends Component {
  @service('theta-sdk') thetaSdk;

  @action
  async connectWallet() {
    const account = await this.thetaSdk.getThetaAccount();
    return await this.thetaSdk.getWalletInfo(account);
  }
}
