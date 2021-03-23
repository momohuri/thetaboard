import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import { getOwner } from '@ember/application';

export default class DashboardRoute extends Route {
  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  async model() {
    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();

    return {};
  }
}
