import Service from '@ember/service';
import * as thetajs from '@thetalabs/theta-js';
import { getOwner } from '@ember/application';

export default class EnvManagerService extends Service {
  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get contract() {
    return getOwner(this).lookup('service:contract');
  }

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  config = {
    env: '',
    explorerEndpoint: '',
    queryParams: '',
    thetaNetwork: '',
    contractAddress: '',
  };

  async setParameters(params) {
    if (params && params.env) {
      this.config.env = params.env;
      if (params.env === 'testnet') {
        this.config.queryParams = '?env=testnet';
        this.config.thetaNetwork = thetajs.networks.ChainIds.Testnet;
        this.config.explorerEndpoint =
          'https://guardian-testnet-explorer.thetatoken.org';
        this.config.contractAddress = '0x053cd0e05e6df3990ee35bd7a640b5aa92e77176';
      } else if (params.env === 'smart-contracts') {
        this.config.queryParams = '?env=smart-contracts';
        this.config.thetaNetwork = thetajs.networks.ChainIds.Privatenet;
        this.config.explorerEndpoint =
          'https://smart-contracts-sandbox-explorer.thetatoken.org';
        this.config.contractAddress = '0x053cd0e05e6df3990ee35bd7a640b5aa92e77176';
      }
    } else {
      this.config.queryParams = '';
      this.config.thetaNetwork = thetajs.networks.ChainIds.Mainnet;
      this.config.env = '';
      this.config.explorerEndpoint = 'https://explorer.thetatoken.org';
      this.config.contractAddress = '0x053cd0e05e6df3990ee35bd7a640b5aa92e77176';
    }
    if (params && params.wa) {
      const wa = params.wa;
      if (wa.length == 42 && wa.substr(1, 1).toLocaleLowerCase() == 'x') {
        await this.thetaSdk.getWalletInfo([wa]);
      } else {
        const nameToAddress = await this.contract.getNameToAddress(wa);
        if (nameToAddress.length && nameToAddress['ownerAddr'] != '0x0000000000000000000000000000000000000000') {
          await this.thetaSdk.getWalletInfo([nameToAddress['ownerAddr']]);
        } else {
          this.utils.errorNotify('Invalid Wallet Address or Domain name');
          this.contract.domainName = '';
        }
      }
    }
    return this.config;
  }
}
