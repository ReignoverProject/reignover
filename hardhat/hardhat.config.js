require("@nomicfoundation/hardhat-toolbox");
require('hardhat-contract-sizer');
const {account, apiKey} = require('./env.json');



import('hardhat/config').HardhatUserConfig 
module.exports = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    polygon: {
      url: "https://polygon-rpc.com",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXx/polygon/mainnet", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      accounts: [account],
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/v9tZMbd55QG9TpLMqrkDc1dQIzgZazV6",
      // url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXX/polygon/mumbai", // <---- YOUR MORALIS ID! (not limited to infura)
      gasPrice: 3200000000,
      accounts: [account],
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan:{
    apiKey: apiKey,
  }
};
