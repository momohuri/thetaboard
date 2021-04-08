import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class WalletTotalComponent extends Component {
  @service('theta-sdk') thetaSdk;

  get walletTotal() {
    let wallets = this.thetaSdk.wallets;
    if (wallets.length == 0) return 0;
    return wallets.reduce(function (previousValue, item) {
      return previousValue + item.value;
    }, 0);
  }
}
