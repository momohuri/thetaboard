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
    isPublic: false,
    isNotPublic: true,
  };

  async setParameters(params) {
    const isPublicReq = await fetch('/is-public');
    const isPublic = await isPublicReq.json();
    if (isPublic && isPublic.success) {
      if(isPublic.is_public == 'true') {
        this.config.isPublic = true;
        this.config.isNotPublic = false;
      }
    }
    if (params && params.env) {
      this.config.env = params.env;
      if (params.env === 'testnet') {
        this.config.queryParams = '?env=testnet';
        this.config.thetaNetwork = thetajs.networks.ChainIds.Testnet;
        this.config.explorerEndpoint =
          'https://guardian-testnet-explorer.thetatoken.org';
        this.config.contractAddress = '0xe53ce9d69ca8718a1528cb0d7cf25fef9e8f4337';
      } else if (params.env === 'smart-contracts') {
        this.config.queryParams = '?env=smart-contracts';
        this.config.thetaNetwork = thetajs.networks.ChainIds.Privatenet;
        this.config.explorerEndpoint =
          'https://smart-contracts-sandbox-explorer.thetatoken.org';
        this.config.contractAddress = '0xe53ce9d69ca8718a1528cb0d7cf25fef9e8f4337';
      }
    } else {
      this.config.queryParams = '';
      this.config.thetaNetwork = thetajs.networks.ChainIds.Mainnet;
      this.config.env = '';
      this.config.explorerEndpoint = 'https://explorer.thetatoken.org';
      this.config.contractAddress = '0xe53ce9d69ca8718a1528cb0d7cf25fef9e8f4337';
    }
    if (params && params.wa) {
      const wa = params.wa;
      if (wa.length == 42 && wa.substr(1, 1).toLocaleLowerCase() == 'x') {
        await this.thetaSdk.getWalletInfo([wa]);
      } else {
        const nameToAddress = await this.contract.getNameToAddress(wa);
        if (
          nameToAddress.length &&
          nameToAddress['ownerAddr'] !=
            '0x0000000000000000000000000000000000000000'
        ) {
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
