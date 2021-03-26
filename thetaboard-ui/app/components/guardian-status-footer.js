import Ember from 'ember';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default class GuardianStatusFooterComponent extends Component {
  @service('guardian') guardian;

  async fetchLatestSnapshot() {
    this.guardian.updateGuardianLatestSnapshotLogs();
    $('button.download-latest-snapshot').removeClass("disabled");
    this.guardian.updateGuardianLatestSnapshot();
  }

  @action
  downloadLatestSnapshot() {
    $('button.download-latest-snapshot').addClass("disabled");
    this.guardian.latestSnapshotLogs = 'Download is about to start.';
    Ember.run.debounce(this, this.fetchLatestSnapshot, null, 500);
  }
}
