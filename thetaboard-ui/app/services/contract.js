import Service from '@ember/service';
import { getOwner } from '@ember/application';
import * as thetajs from '@thetalabs/theta-js';
import { tracked } from '@glimmer/tracking';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import BigNumber from "bignumber.js";

export default class ContractService extends Service {
  constructor(...args) {
    super(...args);
    this.tfuelPrice = 5;
    this.domainName = '';
    this.walletAddress = '';
    this.contract = {};
    this.addressToName = [];
    this.nameToAddress = [];
    this.offersReceived = [];
    this.offersMade = [];
    this.initContract();
  }

  @tracked tfuelPrice;
  @tracked domainName;
  @tracked addressToName;
  @tracked nameToAddress;
  @tracked walletAddress;
  @tracked offersReceived;
  @tracked offersMade;

  get envManager() {
    return getOwner(this).lookup('service:env-manager');
  }

  get utils() {
    return getOwner(this).lookup('service:utils');
  }

  get thetaSdk() {
    return getOwner(this).lookup('service:theta-sdk');
  }

  get isMobile() {
    return getOwner(this).lookup('service:is-mobile');
  }

  async initContract() {
    let ABI = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "offerId",
            "type": "uint256"
          }
        ],
        "name": "offerMade",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "offerId",
            "type": "uint256"
          }
        ],
        "name": "acceptOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "addressToNames",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "address payable",
            "name": "walletAddr",
            "type": "address"
          }
        ],
        "name": "assignNewName",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "offerId",
            "type": "uint256"
          }
        ],
        "name": "cancelOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "walletAddr",
            "type": "address"
          }
        ],
        "name": "getAddressToNames",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "walletAddr",
            "type": "address"
          }
        ],
        "name": "getOffersMadeName",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address payable",
            "name": "walletAddr",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "getOffersMadeNameId",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          }
        ],
        "name": "makeOffer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "maxOfferIds",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "nameToAddress",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "ownerAddr",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "indexInAddressToNames",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offersForName",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "offerAmount",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "walletMakingOffer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "offersMadeNameIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "offersMadeNameIdIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "offerId",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offersMadeName",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "offersMadeNameId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "offerId",
            "type": "uint256"
          }
        ],
        "name": "rejectOffer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newPrice",
            "type": "uint256"
          }
        ],
        "name": "setTfuelPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "tfuelPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    let provider = new thetajs.providers.HttpProvider(
      this.envManager.config.thetaNetwork
    );
    try {
      this.contract = new thetajs.Contract(
        this.envManager.config.contractAddress,
        ABI,
        provider
      );
      const price = await this.contract.tfuelPrice();
      this.tfuelPrice = thetajs.utils.fromWei(price);
      return;
    } catch (error) {
      if (this.isMobile.any) {
        return;
      }
      return this.utils.errorNotify(error.message);
    }
  }

  async getAddressToNames(address) {
    if (
      address.length != 42 &&
      address.substr(1, 1).toLocaleLowerCase() != 'x'
    ) {
      this.utils.errorNotify('Please enter a valid address.');
      return null;
    }
    try {
      const allAddressToName = await this.contract.getAddressToNames(address);
      this.addressToName = allAddressToName
        .filter(this.onlyUnique)
        .filter(this.filtered);
      this.walletAddress = address;
      return this.addressToName;
    } catch (error) {
      this.utils.errorNotify(error.message);
      return null;
    }
  }

  async getNameToAddress(name) {
    if (name.length == 42 && name.substr(1, 1).toLocaleLowerCase() == 'x') {
      this.utils.errorNotify('This is a wallet address not a domain name.');
      return null;
    }
    try {
      this.nameToAddress = await this.contract.nameToAddress(name);
      this.domainName = name;
      return this.nameToAddress;
    } catch (error) {
      this.utils.errorNotify(error.message);
      return null;
    }
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  filtered(value) {
    return value != '';
  }

  async getOffersMade(walletAddress) {
    this.offersMade = [];
    const allOffersMadeName = await this.contract.getOffersMadeName(walletAddress);
    const filteredOffersMadeName = allOffersMadeName.filter(this.onlyUnique);
    const offersMadeName = filteredOffersMadeName.filter(this.filtered);
    if (offersMadeName) {
      for (let i = 0; i < offersMadeName.length; i++) {
        const offersMadeIds = await this.contract.getOffersMadeNameId(
          walletAddress,
          offersMadeName[i]
        );
        for (let j = 0; j < offersMadeIds.length; j++) {
          const offer = await this.contract.offersForName(
            offersMadeName[i],
            offersMadeIds[j]
          );
          if (
            offer.length &&
            offer.walletMakingOffer !=
              '0x0000000000000000000000000000000000000000'
          ) {
            const result = {
              domainName: offersMadeName[i],
              offer: this.serializeOffer(offer),
            };
            this.offersMade.push(result);
          }
        }
      }
    }
    return this.offersMade;
  }

  async getOfferReceived(walletAdress) {
    this.offersReceived = [];
    const domainList = await this.contract.getAddressToNames(walletAdress);
    for (let i = 0; i < domainList.length; i++) {
      const offers = await this.offersForName(domainList[i]);
      if (offers.length) {
        const offersSerialized = this.serializeOffers(offers);
        if (offersSerialized.length) {
          const result = {
            domainName: domainList[i],
            offers: offersSerialized,
          };
          this.offersReceived.push(result);
        }
      }
    }
    return this.offersReceived;
  }

  async offersForName(domainName) {
    let offersForName = [];
    const maxOfferId = await this.contract.maxOfferIds(domainName);
    for (let i = 1; i < maxOfferId.toNumber() + 1; i++) {
      offersForName.push(await this.contract.offersForName(domainName, i));
    }
    return offersForName;
  }

  serializeOffers(offers) {
    let offersSerialized = [];
    for (let i = 0; i < offers.length; i++) {
      if (
        offers[i].length &&
        offers[i].walletMakingOffer !=
          '0x0000000000000000000000000000000000000000'
      ) {
        const offer = this.serializeOffer(offers[i]);
        offersSerialized.push(offer);
      }
    }
    return offersSerialized;
  }

  serializeOffer(offer) {
    const serializedOffer = {
      offerId: offer.offerId.toNumber(),
      offerAmount: thetajs.utils.fromWei(offer.offerAmount._hex),
      walletMakingOffer: offer.walletMakingOffer,
      offersMadeNameIndex: offer.offersMadeNameIndex.toNumber(),
      offersMadeNameIdIndex: offer.offersMadeNameIdIndex.toNumber(),
    };
    return serializedOffer;
  }

  async assignNewName(domainName, walletAddress) {
    if (
      domainName.length == 42 &&
      domainName.substr(1, 1).toLocaleLowerCase() == 'x'
    ) {
      return this.utils.errorNotify('This is a wallet address not a domain name.');
    }
    try {
      const walletPayer = await this.thetaSdk.getThetaAccount();
      const options = {
        from: walletPayer[0],
        value: thetajs.utils.toWei(this.tfuelPrice),
      };
      const walletReceiver = walletAddress ? walletAddress : walletPayer[0];
      const transaction = await this.contract.populateTransaction.assignNewName(
        domainName,
        walletReceiver,
        options
      );
      const result = await ThetaWalletConnect.sendTransaction(transaction);
      if (result && result.hash) {
        result.walletReceiver = walletReceiver;
        return result;
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
      return error;
    }
  }

  async makeOffer(domainName, offerAmount, owner) {
    if (offerAmount < 1) {
      return this.utils.errorNotify('You must offer at least 1 Tfuel to buy this domain.');
    } else {
      try {
        const walletPayer = await this.thetaSdk.getThetaAccount();
        if (owner[0] == walletPayer[0]) {
          return this.utils.errorNotify("You already own this domain and can't make an offer.");
        }
        const options = {
          from: walletPayer[0],
          value: thetajs.utils.toWei(offerAmount),
        };
        const transaction = await this.contract.populateTransaction.makeOffer(
          domainName,
          options
        );
        const result = await ThetaWalletConnect.sendTransaction(transaction);
        if (result && result.hash) {
          return result;
        }
      } catch (error) {
        this.utils.errorNotify(error.message);
        return error;
      }
    }
  }

  async cancelOffer(offer) {
    try {
      const walletPayer = await this.thetaSdk.getThetaAccount();
      if (offer.offer.walletMakingOffer != walletPayer[0]) {
        return this.utils.errorNotify("Only the owner of the offer can cancel it.");
      }
      const options = {
        from: walletPayer[0],
      };
      const transaction = await this.contract.populateTransaction.cancelOffer(
        offer.domainName,
        offer.offer.offerId,
        options
      );
      const result = await ThetaWalletConnect.sendTransaction(transaction);
      if (result && result.hash) {
        return result;
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
      return error;
    }
  }

  async acceptOffer(offer) {
    try {
      const walletPayer = await this.thetaSdk.getThetaAccount();
      const ownerAddress = await this.contract.nameToAddress(offer.domainName);
      if (ownerAddress.ownerAddr != walletPayer[0]) {
        return this.utils.errorNotify("Only the owner of the domain can accpept this offer. You are now connected to the address " + walletPayer[0]);
      }
      const options = {
        from: walletPayer[0],
      };
      const transaction = await this.contract.populateTransaction.acceptOffer(
        offer.domainName,
        offer.offer.offerId,
        options
      );
      const result = await ThetaWalletConnect.sendTransaction(transaction);
      if (result && result.hash) {
        result.offer = offer;
        result.ownerAddr = ownerAddress.ownerAddr;
        return result;
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
      return error;
    }
  }

  async rejectOffer(offer) {
    try {
      const walletPayer = await this.thetaSdk.getThetaAccount();
      const ownerAddress = await this.contract.nameToAddress(offer.domainName);
      if (ownerAddress.ownerAddr != walletPayer[0]) {
        return this.utils.errorNotify("Only the owner of the domain can reject this offer.");
      }
      const options = {
        from: walletPayer[0],
      };
      const transaction = await this.contract.populateTransaction.rejectOffer(
        offer.domainName,
        offer.offer.offerId,
        options
      );
      const result = await ThetaWalletConnect.sendTransaction(transaction);
      if (result && result.hash) {
        result.offer = offer;
        result.ownerAddr = ownerAddress.ownerAddr;
        return result;
      }
    } catch (error) {
      this.utils.errorNotify(error.message);
      return error;
    }
  }
}
