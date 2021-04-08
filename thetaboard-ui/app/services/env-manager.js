import Service from '@ember/service';
import * as thetajs from '@thetalabs/theta-js';
import { getOwner } from '@ember/application';

export default class EnvManagerService extends Service {

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  config = {
    env: '',
    explorerEndpoint: '',
    queryParams: '',
    thetaNetwork: '',
  };

  async setParameters(params) {
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
    if (params && params.wa) {
      const wa = params.wa;
      if (wa.length == 42 && wa.substr(1, 1).toLocaleLowerCase() == 'x') {
        await this.thetaSdk.getWalletInfo([wa]);
      }
    }
    return this.config;
  }
}
