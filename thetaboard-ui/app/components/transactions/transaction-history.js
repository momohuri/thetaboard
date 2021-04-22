import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import $ from 'jquery';

export default class TransactionHistoryComponent extends Component {
  constructor(...args) {
    super(...args);
    this.account = '';
  }
  @service('env-manager') envManager;
  @service('theta-sdk') thetaSdk;

  async initialize() {
    if (this.thetaSdk.currentAccount && this.thetaSdk.currentAccount != this.account) {
      this.account = this.thetaSdk.currentAccount;
      return await this.thetaSdk.getTransactions(this.thetaSdk.currentAccount);
    }
  }

  get transactionList() {
    this.initialize();
    return this.thetaSdk.transactions;
  }

  get showPagination() {
    const pagination = this.thetaSdk.pagination;
    if (pagination && !!pagination.totalPageNumber)
      return !!pagination.totalPageNumber && !!(pagination.totalPageNumber > 1);
    return false;
  }

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  async changePagination(current) {
    const account = this.thetaSdk.currentAccount;
    await this.thetaSdk.getTransactions(account, current);
    $('nav[aria-label="Page navigation"] .pager li').removeClass("disabled");
  }

  @action
   pageChanged(current) {
    $('nav[aria-label="Page navigation"] .pager li').addClass("disabled");
    Ember.run.debounce(this, this.changePagination, current, 1000, true);
  }
}
