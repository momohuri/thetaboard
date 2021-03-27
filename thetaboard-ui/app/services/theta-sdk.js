import Service from '@ember/service';
import { getOwner } from '@ember/application';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import { tracked } from '@glimmer/tracking';
import BigNumber from "bignumber.js";

export default class ThetaSdkService extends Service {
  constructor(...args) {
    super(...args);
    this.downloadProgress = '';
  }

  @tracked downloadProgress = '';

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  get thetaStakes() {
    return getOwner(this).lookup('service:theta-stakes');
  }

  async getThetaAccount() {
    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    await ThetaWalletConnect.connect();
    return await ThetaWalletConnect.requestAccounts();
  }

  async sendThetaTransaction(type) {
    debugger
    const source = await this.getThetaAccount();
    const holderSummary = "GUARDIAN_NODE_SUMMARY";
    const txData = {
      source: source[0],
      holderSummary: holderSummary,
      purpose: thetajs.constants.StakePurpose.StakeForGuardian,
    };
debugger
    if (type == 'deposit') {
      const stakeAmount = this.thetaStakes.stakeAmount;
      if (stakeAmount && stakeAmount > 999) {
        const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
        const thetaWeiToStake = (new BigNumber(stakeAmount)).multipliedBy(ten18);
        txData.thetaWeiToStake = thetaWeiToStake;
        let stakeTx = new thetajs.transactions.DepositStakeV2Transaction(txData);
        // const stakeTxResult = await ThetaWalletConnect.sendTransaction(stakeTx);
        // return stakeTxResult.hash;
      } else {
        return { success: false, msg: 'Please provide a stake amout of 1000 minimum' };
      }
    } else if (type == 'withdraw') {
      let withdrawTx = new thetajs.transactions.WithdrawStakeTransaction(txData);
      // const withdrawTxResult = await ThetaWalletConnect.sendTransaction(withdrawTx);
      // return withdrawTxResult.hash;
    }
  }

  async getWalletInfo(accounts) {
    const walletInfo = await fetch(
      '/wallet-info/' + accounts[0] + this.envManager.config.queryParams
    );
    return await walletInfo.json();
  }

  async getTransactions(accounts, current) {
    let finalUrl = '/wallet-transactions/' + accounts[0] + this.envManager.config.queryParams;

    if (current) {
      this.envManager.config.queryParams ? (finalUrl += '&') : (finalUrl += '?');
      finalUrl += 'pageNumber=' + current;
    }

    const transactions = await fetch(finalUrl);
    return await transactions.json();
  }

  async getGuardianStatus() {
    const response = await fetch(
      '/guardian/status' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async readableStreamDownload(response) {
    const self = this;
    const reader = response.body.getReader();
    const contentLength = response.headers.get('Content-Length') || 1976919;
    let receivedLength = 0;
    let result = '';
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              self.downloadProgress = '';
              return result;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            result += value;
            receivedLength += value.length;
            self.downloadProgress = `${((receivedLength/contentLength)*100).toFixed(1)}`;
            return pump();
          });
        }
      },
    });
  }

  async readableStream(response) {
    const reader = response.body.getReader();
    let result = '';
    return new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return result;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            result += value;
            return pump();
          });
        }
      },
    });
  }

  async getGuardianLogs() {
    const self = this;
    return await fetch('/guardian/logs' + this.envManager.config.queryParams)
      .then((response) => self.readableStream(response))
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        return blob.text().then((text) => {
          return { logs: text };
        });
      })
      .catch((err) => console.error(err));
  }

  async getGuardianSummary() {
    const response = await fetch(
      '/guardian/summary' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async getGuardianLatestSnapshot() {
    const response = await fetch(
      '/guardian/latest_snapshot' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async startGuardian() {
    const response = await fetch(
      '/guardian/start' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async stopGuardian() {
    const response = await fetch(
      '/guardian/stop' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async downloadLatestGuardianSnapshot() {
    const self = this;
    return await fetch('/guardian/download_snapshot' + this.envManager.config.queryParams)
      .then((response) => self.readableStreamDownload(response))
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        return blob.text().then((text) => {
          return { logs: text };
        });
      })
      .catch((err) => console.error(err));
  }
}
