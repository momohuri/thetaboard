import Ember from 'ember';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class GuardianStatusFooterComponent extends Component {
  @service('guardian') guardian;
  @service('theta-sdk') thetaSdk;

  async fetchLatestSnapshot() {
    await this.guardian.updateGuardianLatestSnapshotLogs();
    await this.guardian.updateGuardianLatestSnapshot();
    $('button.download-latest-snapshot').removeClass("disabled");
  }

  @action
  downloadLatestSnapshot() {
    $('button.download-latest-snapshot').addClass("disabled");
    this.guardian.latestSnapshotLogs = 'Download is about to start.';
    Ember.run.debounce(this, this.fetchLatestSnapshot, null, 500);
  }
}
