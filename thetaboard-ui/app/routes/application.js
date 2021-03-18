import Route from '@ember/routing/route';

export default class DashboardRoute extends Route {
  async model() {
    const response = await fetch('/guardian/status');
    const gardianStatus = await response.json();
    return gardianStatus;
  }
}
