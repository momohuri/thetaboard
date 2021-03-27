import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianStatusNotificationComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  @service('guardian') guardian;
}
