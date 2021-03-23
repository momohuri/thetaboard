import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TransactionHistoryComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @service('env-manager') envManager;

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  get transactionList() {
    let { transactions } = this.args;
    return transactions;
  }
}
