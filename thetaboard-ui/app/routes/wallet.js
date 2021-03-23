import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import { getOwner } from '@ember/application';

export default class WalletRoute extends Route {
  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  async model() {
    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();
    const walletInfoResult = await fetch(
      '/wallet-info/' + accounts[0] + this.envManager.config.queryParams
    );
    const walletInfo = await walletInfoResult.json();
    const transactionsResult = await fetch(
      '/wallet-transactions/' + accounts[0] + this.envManager.config.queryParams
    );
    const transactions = await transactionsResult.json();
    return {
      wallets: walletInfo.wallets,
      transactions: transactions.transactions,
      pagination: transactions.pagination,
    };
  }
}
