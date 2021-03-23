import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import $ from 'jquery';

export default class TransactionHistoryComponent extends Component {
  constructor(...args) {
    super(...args);
    let { transactions, pagination } = this.args;
    this.transactions = transactions;
    this.pagination = pagination;
  }
  @service('env-manager') envManager;
  @service('theta-sdk') thetaSdk;
  @tracked pagination = {};
  @tracked transactions = [];

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  async changePagination(current) {
    const account = await this.thetaSdk.getThetaAccount();
    const transactions = await this.thetaSdk.getTransactions(account, current);
    this.transactions = transactions.transactions;
    $('nav[aria-label="Page navigation"] .pager li').removeClass("disabled");
    this.pagination = transactions.pagination;
  }

  @action
   pageChanged(current) {
    $('nav[aria-label="Page navigation"] .pager li').addClass("disabled");
    Ember.run.debounce(this, this.changePagination, current, 1000);
  }
}
