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
    this.coinbases = [];
    this.coinbasesLoaded = false;
    this.pagination = {};
    this.currentAccount = '';
    this.currentAccountDomainList = [];
    this.prices = {};
    this.getPrices();
    this.totalStake = {};
    this.getTotalStake();
  }

  @tracked downloadProgress;
  @tracked wallets;
  @tracked currentAccount;
  @tracked prices;
  @tracked pagination;
  @tracked transactions;
  @tracked coinbases;
  @tracked coinbasesLoaded;
  @tracked currentAccountDomainList

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  get thetaStakes() {
    return getOwner(this).lookup('service:theta-stakes');
  }

  get guardian() {
    return getOwner(this).lookup('service:guardian');
  }

  get contract() {
    return getOwner(this).lookup('service:contract');
  }

  get offer() {
    return getOwner(this).lookup('service:offer');
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

  async connectWallet() {
    $('.connect-wallet-offer-button').addClass("disabled");
    $('.connect-wallet-button').addClass("disabled");
    const address = await this.getThetaAccount();
    await this.getWalletInfo(address);
    await this.offer.setupOffers(address);
    $('.connect-wallet-offer-button').removeClass("disabled");
    $('.connect-wallet-button').removeClass("disabled");
    return this.contract.domainName ? this.contract.domainName : address[0];
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
      'explorer/prices' + this.envManager.config.queryParams
    );
    if (getPrices.status == 200) {
      prices = await getPrices.json();
    }
    this.prices = prices;
    return prices;
  }

  async getTotalStake() {
    let totalStake = { totalAmount: '0', totalNodes: 0 };
    const getStake = await fetch(
      'explorer/totalStake' + this.envManager.config.queryParams
    );
    if (getStake.status == 200) {
      totalStake = await getStake.json();
    }
    totalStake.totalAmount = thetajs.utils.fromWei(totalStake.totalAmount);
    this.totalStake = totalStake;
    return totalStake;
  }

  async getWalletInfo(accounts) {
    let wallets = { wallets: [] };
    this.contract.domainName = '';
    const walletInfo = await fetch(
      '/wallet-info/' + accounts[0] + this.envManager.config.queryParams
    );
    if (walletInfo.status == 200) {
      wallets = await walletInfo.json();
    }
    if (accounts.length) {
      this.currentAccountDomainList = await this.contract.getAddressToNames(
        accounts[0]
      );
      if (this.currentAccountDomainList.length) {
        this.contract.domainName = this.currentAccountDomainList[0];
      }
    } else {
      this.currentAccountDomainList = [];
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

  async getCoinbases(accounts, pageNumber = 1) {
    let url = `${this.envManager.config.explorerEndpoint}:8443/api/accounttx/${accounts[0]}/?type=-1&pageNumber=${pageNumber}&limitNumber=90&isEqualType=true&types=["0"]`;
    const coinbases = await fetch(url);
    if (coinbases.status == 200) {
      const result = await coinbases.json();
      return result.body;
    }
    return [];
  }

  async getAllCoinbases(accounts) {
    this.coinbasesLoaded = false;
    const wei_divider = 1000000000000000000;
    let pageNumber = 1;
    let coinbaseList = [];
    let keepFectching = true;
    while (keepFectching && pageNumber < 5) {
      let coinbases = await this.getCoinbases(accounts, pageNumber);
      if (!coinbases.length) {
        keepFectching = false;
        break;
      }
      if (coinbases.length != 90) {
        keepFectching = false;
      }
      coinbases.map((x) => {
        const to = x["data"]["outputs"].filter(x => x['address'].toUpperCase() === accounts['0'].toUpperCase())[0];
        coinbaseList.push({
          "timestamp": x["timestamp"],
          "amount": to["coins"]["tfuelwei"] / wei_divider,
          "value": to["coins"]["tfuelwei"] / wei_divider * this.prices.tfuel.price
        });
      });
      coinbases = [];
      pageNumber++;
    }
    this.coinbases = coinbaseList;
    this.coinbasesLoaded = true;
    return coinbaseList;
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
