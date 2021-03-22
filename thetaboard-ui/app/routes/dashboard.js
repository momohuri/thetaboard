import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';

export default class DashboardRoute extends Route {
  async model(params, transition) {
    let provider = new thetajs.providers.HttpProvider(
      transition.data.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();
    const response = await fetch(
      '/wallet-info/' + accounts[0] + transition.data.queryParams
    );
    const walletInfo = await response.json();
    return walletInfo;
  }
}
