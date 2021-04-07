import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import { action } from '@ember/object';
import {tracked} from '@glimmer/tracking';
import Evented from '@ember/object/evented';

export default class ConnectWalletConnectWalletComponent extends Component {
  @service('theta-sdk') thetaSdk;

  currentAccount = this.thetaSdk.getCurrentAccount;

  @action
  async connectWallet() {
    const account = await this.thetaSdk.getThetaAccount();
    return await this.thetaSdk.getWalletInfo(account);
  }
}
