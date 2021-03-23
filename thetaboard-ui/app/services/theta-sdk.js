import Service from '@ember/service';
import { getOwner } from '@ember/application';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';

export default class ThetaSdkService extends Service {

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  async getThetaAccount() {
    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    return await ThetaWalletConnect.requestAccounts();
  }

  async getWalletInfo(accounts) {
    const walletInfo = await fetch(
      '/wallet-info/' + accounts[0] + this.envManager.config.queryParams
    );
    return await walletInfo.json();
  }

  async getTransactions(accounts, current) {
    let finalUrl = '/wallet-transactions/' + accounts[0] + this.envManager.config.queryParams;

    if (current) {
      this.envManager.config.queryParams ? (finalUrl += '&') : (finalUrl += '?');
      finalUrl += 'pageNumber=' + current;
    }

    const transactions = await fetch(finalUrl);
    return await transactions.json();
  }

  async getGardianStatus(params) {
    this.envManager.setParameters(params);
    const response = await fetch(
      '/guardian/status' + this.envManager.config.queryParams
    );
    return await response.json();
  }
}
