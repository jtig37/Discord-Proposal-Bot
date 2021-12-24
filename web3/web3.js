const Contract = require('web3-eth-contract');
const fs = require('fs');
const { contractAddress, infuraURL } = require('../config.json');
const abi = JSON.parse(fs.readFileSync(__dirname + '/abi.json', 'utf8'));

class GrayBoyContract {
  constructor() {
    Contract.setProvider(infuraURL);
    this.contract = new Contract(abi, contractAddress);
  }

  async balanceOf(address) {
    const balance = await this.contract.methods.balanceOf(address).call();
    console.log({ balance });
    return balance;
  }
}

module.exports = GrayBoyContract;
