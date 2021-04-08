import Component from '@glimmer/component';

export default class WalletTotalComponent extends Component {
  get walletTotal() {
    let { wallet } = this.args;
    if (!wallet || wallet.length == 0) return 0;

    return wallet.reduce(function (previousValue, item) {
      return previousValue + item.value;
    }, 0);
  }
}
