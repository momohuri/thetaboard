import Route from '@ember/routing/route';
import {getOwner} from '@ember/application';

export default class DashboardRoute extends Route {
  get guardian() {
    return getOwner(this).lookup('service:guardian');
  }

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  async model() {
    const oneYearBack = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const historicPrice = await fetch(
      `https://www.thetascan.io/api/price/?start_date=${oneYearBack}&end_date=${today}`
    );
    const account = await this.thetaSdk.getThetaAccount();
    const walletInfo = await this.thetaSdk.getWalletInfo(account);
    return {"historicPrice": await historicPrice.json(), 'walletInfo': walletInfo, guardian: this.guardian};
  }
}
