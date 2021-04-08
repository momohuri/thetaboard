import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class GuardianStatusBodyComponent extends Component {
  @service('guardian') guardian;
  @service('theta-sdk') thetaSdk;
}
