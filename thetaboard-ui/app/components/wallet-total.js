import Component from '@glimmer/component';

export default class WalletTotalComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  get walletTotal() {
    let { wallet } = this.args;
    return wallet.reduce(function (previousValue, item) {
      return previousValue + item.value;
    }, 0);
  }
}
