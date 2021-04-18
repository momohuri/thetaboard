import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FaqController extends Controller {
  @service('guardian') guardian;
  @service('utils') utils;

  @action
  copySummaryToClipBoard(label, value) {
    this.utils.copyToClipboard(
      value,
      `${label} was successfully copied to your clipboad`
    );
  }
}
