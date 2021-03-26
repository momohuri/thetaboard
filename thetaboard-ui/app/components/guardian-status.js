import Ember from 'ember';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class GuardianStatusComponent extends Component {
  constructor(...args) {
    super(...args);
    this.guardian.statusInterval = 5000;
    this.guardian.logsAutoRefresh = true;
    this.guardian.autoRefreshLogs();
  }

  @service('theta-sdk') thetaSdk;
  @service('guardian') guardian;

  willDestroy () {
    this.guardian.logsAutoRefresh = false;
    this.guardian.statusInterval = 60000;
  }
}
