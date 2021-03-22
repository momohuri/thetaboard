import Route from '@ember/routing/route';
import * as thetajs from '@thetalabs/theta-js';

export default class ApplicationRoute extends Route {
  queryParams = {
    env: {
      refreshModel: true,
    },
  };

  async model(params, transition) {
    if (params && params.env) {
      if (params.env === 'testnet') {
        params.queryParams = '?env=testnet';
        params.thetaNetwork = thetajs.networks.ChainIds.Testnet;
      } else if (params.env === 'smart-contracts') {
        params.queryParams = '?env=smart-contracts';
        params.thetaNetwork = thetajs.networks.ChainIds.TestnetSapphire;
      }
    } else {
      params = {
        queryParams: '',
        thetaNetwork: thetajs.networks.ChainIds.Mainnet,
        env: '',
      };
    }
    transition.data = params;
    const response = await fetch('/guardian/status' + params.queryParams);
    const gardianStatus = await response.json();
    return gardianStatus;
  }
}
