import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { cancel } from '@ember/runloop';

export default class GuardianStatusComponent extends Component {
  constructor(...args) {
    super(...args);
    this.guardian.statusInterval = 5000;
    if (this.guardian.statusLaterCall) {
      cancel(this.guardian.statusLaterCall);
      this.guardian.autoRefreshStatus();
    }

    this.guardian.logsAutoRefresh = false;
    if (this.guardian.logsLaterCall) {
      cancel(this.guardian.logsLaterCall);
    }
  }

  @service('theta-sdk') thetaSdk;
  @service('guardian') guardian;

  willDestroy() {
    super.willDestroy(...arguments);
    this.guardian.logsAutoRefresh = false;
    this.guardian.statusInterval = 60000;
  }
}
