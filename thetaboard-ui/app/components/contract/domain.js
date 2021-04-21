import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ContractDomainComponent extends Component {
  constructor(...args) {
    super(...args);
    this.domainName = '';
    this.searchedDomain = '';
    this.walletAddress = '';
    this.nameToAddress = [];
    this.offerAmount = '';
    this.walletAddressPayer = '';
    this.walletAddressReceiver = '';
    this.assignToBuyer = true;
  }

  @service('contract') contract;
  @service('theta-sdk') thetaSdk;
  @service('utils') utils;
  @service('offer') offer;

  @tracked domainName;
  @tracked walletAddress;
  @tracked offerAmount;
  @tracked walletAddressPayer;
  @tracked walletAddressReceiver;
  @tracked nameToAddress;
  @tracked assignToBuyer;

  @action
  setupEventListener() {
    $('#domainModal').on('hidden.bs.modal', () => {
      this.domainName = '';
      this.searchedDomain = '';
      this.walletAddressReceiver = '';
      this.offer.connectWallet();
    });
  }

  @action
  setupOfferMadeEventListener() {
    $('#offerMadeModal').on('hidden.bs.modal', () => {
      this.domainName = '';
      this.offerAmount = '';
      this.searchedDomain = '';
      this.offer.connectWallet();
    });
  }

  get domainOwner() {
    if (
      this.nameToAddress.length &&
      this.nameToAddress['ownerAddr'] !=
        '0x0000000000000000000000000000000000000000'
    ) {
      return this.nameToAddress['ownerAddr'];
    } else {
      return false;
    }
  }

  get canByDomain() {
    return !!(
      !this.domainOwner &&
      this.domainName &&
      this.domainName == this.searchedDomain
    );
  }

  get canMakeOffer() {
    return !!(
      this.domainOwner &&
      this.domainName &&
      this.domainName == this.searchedDomain
    );
  }

  get canSearch() {
    return !this.canByDomain && !this.canMakeOffer;
  }

  @action
  async nameToAddressAction(event) {
    event.preventDefault();
    if (
      this.domainName.length == 42 &&
      this.domainName.substr(1, 1).toLocaleLowerCase() == 'x'
    ) {
      this.utils.errorNotify('This is a wallet address not a domain name.');
      return null;
    }
    try {
      this.nameToAddress = await this.contract.contract.nameToAddress(this.domainName);
      this.searchedDomain = this.domainName;
    } catch (error) {
      this.utils.errorNotify(error.message);
    }
  }

  @action
  cancel() {
    this.domainName = '';
    this.walletAddressReceiver = '';
    this.assignToBuyer = true;
  }

  @action
  async assignNewName(event) {
    event.preventDefault();
    const assignedNewName = await this.contract.assignNewName(this.domainName, this.walletAddressReceiver);
    if (assignedNewName && assignedNewName.hash) {
      this.walletAddressReceiver = assignedNewName.walletReceiver;
      $('#domainModal').modal('show');
    }
  }

  @action
  async makeOffer(event) {
    event.preventDefault();
    const offerMade =  await this.contract.makeOffer(this.domainName, this.offerAmount, this.nameToAddress);
    if (offerMade && offerMade.hash) {
      $('#offerMadeModal').modal('show');
    }
  }

  @action
  giftDomain() {
    this.assignToBuyer = false;
    this.walletAddressReceiver = '';
  }

  @action
  resetGiftDomain() {
    this.assignToBuyer = true;
    this.walletAddressReceiver = '';
  }
}
