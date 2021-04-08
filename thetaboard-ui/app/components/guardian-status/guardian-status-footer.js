import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianStatusFooterComponent extends Component {
  @service('guardian') guardian;
  @service('theta-sdk') thetaSdk;
}
