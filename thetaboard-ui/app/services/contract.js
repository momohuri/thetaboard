import Service from '@ember/service';
import { getOwner } from '@ember/application';
import * as thetajs from '@thetalabs/theta-js';
import { tracked } from '@glimmer/tracking';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';

export default class ContractService extends Service {
  constructor(...args) {
    super(...args);
    this.tfuelPrice = 5;
    this.domainName = '';
    this.walletAddress = '';
    this.contract = {};
    this.addressToName = [];
    this.nameToAddress = [];
    //this.initContract();
  }

  @tracked tfuelPrice;
  @tracked domainName;
  @tracked addressToName;
  @tracked nameToAddress;
  @tracked walletAddress;

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
      this.contract = new thetajs.Contract(this.envManager.config.contractAddress, ABI, provider);
      const price = await this.contract.tfuelPrice();
      this.tfuelPrice = thetajs.utils.fromWei(price);
    } catch (error) {
      if (this.isMobile.any) {
        return;
      }
      return this.utils.errorNotify(error.message);
    }
  }

  async getAddressToNames(address) {
    if (address.length != 42 && address.substr(1, 1).toLocaleLowerCase() != 'x') {
      this.utils.errorNotify('Please enter a valid address.');
      return null;
    }
    try {
      this.addressToName = await this.contract.getAddressToNames(address);
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

  async assignNewName(domainName, walletAddress) {
    if (!walletAddress) {
      return this.utils.errorNotify("Please enter the receiver's address.");
    }
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

      const transaction = await this.contract.populateTransaction.assignNewName(
        domainName,
        walletAddress,
        options
      );
      const result = await ThetaWalletConnect.sendTransaction(transaction);
      return result;
    } catch (error) {
      this.utils.errorNotify(error.message);
      return error;
    }
  }

  async makeOffer(offerAmount) {
    if (offerAmount < 1) {
      return this.utils.errorNotify('You must offer at least 1 Tfuel to buy this domain.');
    } else {
      try {
        const walletPayer = await this.thetaSdk.getThetaAccount();
        const options = {
          from: walletPayer[0],
          value: thetajs.utils.toWei(offerAmount),
        };
        const transaction = await this.contract.populateTransaction.makeOffer(
          this.domainName,
          options
        );
        const result = await ThetaWalletConnect.sendTransaction(transaction);
        return result;
      } catch (error) {
        this.utils.errorNotify(error.message);
        return error;
      }
    }
  }
}
