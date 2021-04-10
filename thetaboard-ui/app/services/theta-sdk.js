import Service from '@ember/service';
import { getOwner } from '@ember/application';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import * as thetajs from '@thetalabs/theta-js';
import { tracked } from '@glimmer/tracking';
import BigNumber from "bignumber.js";
import { htmlSafe } from '@ember/template';
import { cancel } from '@ember/runloop';
import { later } from '@ember/runloop';

export default class ThetaSdkService extends Service {
  constructor(...args) {
    super(...args);
    this.downloadProgress = '';
    this.wallets = [];
    this.transactions = [];
    this.pagination = {};
    this.currentAccount = '';
    this.prices = {};
    this.getPrices();
  }

  @tracked downloadProgress;
  @tracked wallets;
  @tracked currentAccount;
  @tracked prices;
  @tracked pagination;
  @tracked transactions;

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  get thetaStakes() {
    return getOwner(this).lookup('service:theta-stakes');
  }

  get guardian() {
    return getOwner(this).lookup('service:guardian');
  }

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  get guardianWallets() {
    if (this.wallets.length) {
      return this.wallets.filter((x) => x.type === 'guardian');
    }
    return [];
  }

  async getThetaAccount() {
    try {
      let provider = new thetajs.providers.HttpProvider(
        this.envManager.config.thetaNetwork
      );
      await ThetaWalletConnect.connect();
      const timeoutId = later(
        this,
        function () {
          this.showDownloadExtensionPopup();
        },
        4000
      );
      const account = await ThetaWalletConnect.requestAccounts();
      return this.setupWalletAddress(account, timeoutId);
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }

  setupWalletAddress(account, timeoutId) {
    cancel(timeoutId);
    this.currentAccount = account;
    $('#downloadThetaExtension').modal('hide');
    return account;
  }

  showDownloadExtensionPopup() {
    $('#downloadThetaExtension').modal('show');
  }

  async sendThetaTransaction(type) {
    const source = await this.getThetaAccount();
    const holderSummary = this.guardian.guardianSummary.msg.Summary;
    const txData = {
      source: source[0],
      holderSummary: holderSummary,
      holder: this.guardian.guardianSummary.msg.Address,
      purpose: thetajs.constants.StakePurpose.StakeForGuardian,
    };
    if (type == 'deposit') {
      const stakeAmount = this.thetaStakes.stakeAmount;
      if (stakeAmount && stakeAmount > 999) {
        const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
        const thetaWeiToStake = (new BigNumber(Number(stakeAmount))).multipliedBy(ten18);
        txData.amount = thetaWeiToStake;
        let stakeTx = new thetajs.transactions.DepositStakeV2Transaction(txData);
        const stakeTxResult = await ThetaWalletConnect.sendTransaction(stakeTx);
        return stakeTxResult;
      } else {
        return {
          success: false,
          msg: 'Please provide a stake amout of 1000 minimum',
        };
      }
    } else if (type == 'withdraw') {
      let withdrawTx = new thetajs.transactions.WithdrawStakeTransaction(txData);
      const withdrawTxResult = await ThetaWalletConnect.sendTransaction(withdrawTx);
      return withdrawTxResult;
    }
  }

  async getPrices() {
    let prices = { theta: 0, tfuel: 0 };
    const getPrices = await fetch(
      '/prices' + this.envManager.config.queryParams
    );
    if (getPrices.status == 200) {
      prices = await getPrices.json();
    }
    this.prices = prices;
    return prices;
  }

  async getWalletInfo(accounts) {
    let wallets = { wallets: [] };
    const walletInfo = await fetch(
      '/wallet-info/' + accounts[0] + this.envManager.config.queryParams
    );
    if (walletInfo.status == 200) {
      wallets = await walletInfo.json();
    }
    this.wallets = wallets.wallets;
    this.currentAccount = accounts;
    return wallets;
  }

  async getTransactions(accounts, current = 1, limit_number = 15) {
    let transactionList = { transactions: [] };
    let finalUrl = '/wallet-transactions/' + accounts[0] + this.envManager.config.queryParams;
    this.envManager.config.queryParams ? (finalUrl += '&') : (finalUrl += '?');
    finalUrl += `pageNumber=${current}&limitNumber=${limit_number}`;
    const transactions = await fetch(finalUrl);
    if (transactions.status == 200) {
      transactionList = await transactions.json();
      this.transactions = transactionList.transactions;
      this.pagination = transactionList.pagination;
    }
    return transactionList;
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
    let textDecoder = new TextDecoder();
    let result = [];
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
            let decodedString = textDecoder.decode(value);
            result.push(decodedString);
            const percentReceived = decodedString.split('%')[0].substr(-3);
            if (percentReceived != '...') {
              if (
                percentReceived != '050' &&
                Number(percentReceived) > self.downloadProgress &&
                Number(percentReceived) < 100
              ) {
                self.downloadProgress = percentReceived;
              }
            }
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
          return { logs: htmlSafe(text.split('\n').join('<br/>')) };
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

  async updateGuardian() {
    const response = await fetch(
      '/guardian/update' + this.envManager.config.queryParams
    );
    return await response.json();
  }

  async downloadLatestGuardianSnapshot() {
    const self = this;
    return await fetch('/guardian/download_snapshot' + this.envManager.config.queryParams)
      .then((response) => self.readableStreamDownload(response))
      .then((stream) => {
        self.utils.successNotify('Downloading...');
        return new Response(stream);
      })
      .then((response) => response.blob())
      .then((blob) => {
        return blob.text().then((logs) => {
          self.utils.successNotify('Download completed. You can now start your Guardian Node');
          return { logs: htmlSafe(logs.split('\n').join('<br/>')) };
        });
      })
      .catch((err) => console.error(err));
  }

  async donation() {
    const ten18 = (new BigNumber(10)).pow(18); // 10^18, 1 Theta = 10^18 ThetaWei, 1 Gamma = 10^ TFuelWei
    const thetaWeiToSend = (new BigNumber(0));
    const tfuelWeiToSend = (new BigNumber(5)).multipliedBy(ten18);
    const account = await this.getThetaAccount();
    const from = account[0];
    const to = '0xa078C2852eb6e455f97EeC21e39F8ef24173Df60';
    const txData = {
      from: from,
      outputs: [
        {
          address: to,
          thetaWei: thetaWeiToSend,
          tfuelWei: tfuelWeiToSend,
        },
      ],
    };
    const transaction = new thetajs.transactions.SendTransaction(txData);
    return ThetaWalletConnect.sendTransaction(transaction);
  }
}
