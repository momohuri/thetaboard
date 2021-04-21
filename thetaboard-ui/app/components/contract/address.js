import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContractAddressComponent extends Component {
  @service('contract') contract;
  @service('theta-sdk') thetaSdk;
  @service('offer') offer;

  async getWalletInfo() {
    const address = await this.offer.connectWallet();
    this.args.onRouteChange(address);
    $('button.connect-wallet-button').removeClass("disabled");
  }

  @action
  async connectWallet() {
    $('button.connect-wallet-button').addClass("disabled");
    Ember.run.debounce(this, this.getWalletInfo, null, 500);
  }
}
