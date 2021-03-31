import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class UptimeUptimeComponent extends Component {
  @service('guardian') guardian;
}
