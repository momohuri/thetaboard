import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

export default class ApplicationRoute extends Route {
  queryParams = {
    env: {
      refreshModel: true,
    },
  };

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  model(params) {
    return this.thetaSdk.getGardianStatus(params);
  }
}
