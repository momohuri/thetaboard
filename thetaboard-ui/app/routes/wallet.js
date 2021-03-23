import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

export default class WalletRoute extends Route {
  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  async model() {
    const account = await this.thetaSdk.getThetaAccount();
    const walletInfo = await this.thetaSdk.getWalletInfo(account);
    const transactions = await this.thetaSdk.getTransactions(account);
    return {
      wallets: walletInfo.wallets,
      transactions: transactions.transactions ? transactions.transactions : [],
      pagination: transactions.pagination ? transactions.pagination : {},
    };
  }
}
