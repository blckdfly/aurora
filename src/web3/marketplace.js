import Web3 from 'web3';
import { MARKETPLACE_ABI, MARKETPLACE_CONTRACT_ADDRESS } from './config';

class MarketplaceService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.initialize();
  }

  initialize() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else {

      this.web3 = new Web3(new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
      ));
    }

    if (MARKETPLACE_CONTRACT_ADDRESS) {
      this.contract = new this.web3.eth.Contract(
        MARKETPLACE_ABI,
        MARKETPLACE_CONTRACT_ADDRESS
      );
    }
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed!");
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    this.web3 = new Web3(window.ethereum);
    
    if (MARKETPLACE_CONTRACT_ADDRESS) {
      this.contract = new this.web3.eth.Contract(
        MARKETPLACE_ABI,
        MARKETPLACE_CONTRACT_ADDRESS
      );
    }

    return accounts[0];
  }

  async getBalance(address) {
    return await this.web3.eth.getBalance(address);
  }

}

export const marketplaceService = new MarketplaceService();