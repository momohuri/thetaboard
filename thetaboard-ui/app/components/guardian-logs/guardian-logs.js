import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class GuardianLogsComponent extends Component {
  @service('guardian') guardian;
  @service('utils') utils;

  @action
  copySummaryToClipBoard(summary) {
    this.utils.copyToClipboard(
      summary.value,
      `${summary.label} was successfully copied to your clipboad`
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
