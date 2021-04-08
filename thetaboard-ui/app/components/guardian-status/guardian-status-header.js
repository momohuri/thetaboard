import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianStatusHeaderComponent extends Component {
  @service('guardian') guardian;
}
