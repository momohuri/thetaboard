import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';

export default class DashboardRoute extends Route {
  async model() {
    let provider = new thetajs.providers.HttpProvider(
      thetajs.networks.ChainIds.Mainnet
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();
    const response = await fetch('/wallet-info/' + accounts[0]);
    const wallet_info = await response.json();
    debugger
    return { wallet_info };
  }
}