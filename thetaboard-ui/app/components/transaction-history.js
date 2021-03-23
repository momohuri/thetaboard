import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import $ from 'jquery';

export default class TransactionHistoryComponent extends Component {
  constructor(...args) {
    super(...args);
    let { transactions, pagination } = this.args;
    this.transactions = transactions;
    this.pagination = pagination;
  }
  @service('env-manager') envManager;
  @tracked pagination = {};
  @tracked transactions = [];

  get explorerEndpoint() {
    return this.envManager.config.explorerEndpoint;
  }

  async changePagination(current) {
    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    const accounts = await ThetaWalletConnect.requestAccounts();
    let finalUrl = '/wallet-transactions/' + accounts[0] + this.envManager.config.queryParams;
    if (this.envManager.config.queryParams) {
      finalUrl += '&'
    } else {
      finalUrl += '?'
    }
    finalUrl += 'pageNumber=' + current;
    const transactionsResult = await fetch(finalUrl);
    const transactions = await transactionsResult.json();
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
