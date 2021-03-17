import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';

export default class WalletRoute extends Route {
  async model() {
    let provider = new thetajs.providers.HttpProvider(
      thetajs.networks.ChainIds.Mainnet
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();
    let balance = await provider.getAccount(accounts[0]);
    return { balance: balance, account: accounts[0] };
  }
}
