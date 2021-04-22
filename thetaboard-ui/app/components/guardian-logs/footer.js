import Ember from 'ember';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class GuardianLogsFooterComponent extends Component {
  @service('guardian') guardian;
  @service('theta-sdk') thetaSdk;
  @service('env-manager') envManager;
  @service('is-mobile') isMobile;

  async fetchLatestSnapshot() {
    await this.guardian.updateGuardianLatestSnapshotLogs();
    await this.guardian.updateGuardianLatestSnapshot();
    $('button.download-latest-snapshot').removeClass("disabled");
  }

  @action
  downloadLatestSnapshot() {
    $('button.download-latest-snapshot').addClass("disabled");
    Ember.run.debounce(this, this.fetchLatestSnapshot, 500, true);
  }
}
