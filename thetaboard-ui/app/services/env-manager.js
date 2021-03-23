import Service from '@ember/service';
import * as thetajs from '@thetalabs/theta-js';

export default class EnvManagerService extends Service {
  config = {
    env: '',
    explorerEndpoint: '',
    queryParams: '',
    thetaNetwork: '',
  };

  setParameters(params) {
    if (params && params.env) {
      this.config.env = params.env;
      if (params.env === 'testnet') {
        this.config.queryParams = '?env=testnet';
        this.config.thetaNetwork = thetajs.networks.ChainIds.Testnet;
        this.config.explorerEndpoint =
          'https://guardian-testnet-explorer.thetatoken.org';
      } else if (params.env === 'smart-contracts') {
        this.config.queryParams = '?env=smart-contracts';
        this.config.thetaNetwork = thetajs.networks.ChainIds.TestnetSapphire;
        this.config.explorerEndpoint =
          'https://smart-contracts-sandbox-explorer.thetatoken.org';
      }
    } else {
      this.config.queryParams = '';
      this.config.thetaNetwork = thetajs.networks.ChainIds.Mainnet;
      this.config.env = '';
      this.config.explorerEndpoint = 'https://explorer.thetatoken.org';
    }
    return this.config;
  }
}
