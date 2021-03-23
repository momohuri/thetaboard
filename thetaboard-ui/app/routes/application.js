import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

export default class ApplicationRoute extends Route {
  queryParams = {
    env: {
      refreshModel: true,
    },
  };

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  async model(params) {
    this.envManager.setParameters(params);
    const response = await fetch(
      '/guardian/status' + this.envManager.config.queryParams
    );
    const gardianStatus = await response.json();
    return gardianStatus;
  }
}
