import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class GuardianLogsComponent extends Component {
  @service('guardian') guardian;
  @service('utils') utils;
  @service('env-manager') envManager;
  @service('is-mobile') isMobile;

  @action
  turnOnLogs() {
    if (this.isMobile.any) {
      this.guardian.refreshLogs();
    } else {
      this.guardian.logsAutoRefresh = true;
      this.guardian.autoRefreshLogs();
    }
  }

  @action
  turnOffLogs() {
    if (this.isMobile.any) {
      return;
    }
    this.guardian.logsAutoRefresh = false;
  }

  @action
  copySummaryToClipBoard(label, value) {
    this.utils.copyToClipboard(
      value,
      `${label} was successfully copied to your clipboad`
    );
  }

  @action
  copyLogsToClipBoard(logs) {
    this.utils.copyToClipboard(
      logs,
      `Logs were successfully copied to your clipboad`
    );
  }
}
