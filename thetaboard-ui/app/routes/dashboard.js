import Route from '@ember/routing/route';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import {getOwner} from '@ember/application';

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
    const oneYearBack = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const historic_price = await fetch(
      `http://www.thetascan.io/api/price/?start_date=${oneYearBack}&end_date=${today}`
    );
    return {"historic_price": await historic_price.json()};
  }
}
