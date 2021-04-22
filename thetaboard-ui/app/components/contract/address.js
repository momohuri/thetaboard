import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ContractAddressComponent extends Component {
  @service('contract') contract;
  @service('theta-sdk') thetaSdk;

  async connectToWallet() {
    const address = await this.thetaSdk.connectWallet();
    this.args.onRouteChange(address);
  }

  @action
  async connectWallet(event) {
    if (event) {
      event.preventDefault();
    }
    Ember.run.debounce(this, this.connectToWallet, 500, true);
  }
}
