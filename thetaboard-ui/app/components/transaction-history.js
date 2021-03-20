import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TransactionHistoryComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  get transactionList() {
    let { transactions } = this.args;
    return transactions;
  }
}
