import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianStatusNotificationComponent extends Component {
  @service('guardian') guardian;
}
