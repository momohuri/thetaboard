import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianLogsComponent extends Component {
  constructor(...args) {
    super(...args);
  }
  @service('guardian') guardian;
}
