import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cancel } from '@ember/runloop';

export default class GuardianStatusComponent extends Component {
  constructor(...args) {
    super(...args);
    if (this.isMobile.any) {
      return;
    }
    this.guardian.statusInterval = 5000;
    this.guardian.logsAutoRefresh = true;
    if (this.guardian.logsLaterCall) {
      cancel(this.guardian.logsLaterCall);
    }
    this.guardian.autoRefreshLogs();
    if (this.guardian.statusLaterCall) {
      cancel(this.guardian.statusLaterCall);
      this.guardian.autoRefreshStatus();
    }
    if (!this.guardian.statusAutoRefresh) {
      this.guardian.statusAutoRefresh = true;
      this.guardian.autoRefreshStatus();
    }
  }

  @service('theta-sdk') thetaSdk;
  @service('guardian') guardian;
  @service('isMobile') isMobile;

  willDestroy() {
    super.willDestroy(...arguments);
    this.guardian.logsAutoRefresh = false;
    this.guardian.statusInterval = 60000;
  }
}
