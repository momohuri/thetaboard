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

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  get guardian() {
    return getOwner(this).lookup('service:guardian');
  }

  async model(params) {
    this.envManager.setParameters(params);
    const guardianStatus = await this.thetaSdk.getGuardianStatus();
    const guardianLogs = await this.thetaSdk.getGuardianLogs();
    //const guardianSummary = await this.thetaSdk.getGuardianSummary();
    const guardianLatestSnapshot = await this.thetaSdk.getGuardianLatestSnapshot();
    this.guardian.setup({
      guardianStatus: guardianStatus,
      guardianLogs: guardianLogs,
      //guardianSummary: guardianSummary,
      guardianLatestSnapshot: guardianLatestSnapshot,
    });
  }
}
