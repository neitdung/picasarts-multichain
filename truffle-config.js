const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://polygon-mumbai.g.alchemy.com/v2/kh59R6ginYKZdeO4nCtq2VItsQN8gb4p`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    // picasarts: {
    //   provider: () => new HDWalletProvider(mnemonic, `http://127.0.0.1:9933`),
    //   network_id: 1281,
    //   confirmations: 2,
    //   timeoutBlocks: 400,
    //   skipDryRun: true
    // },
    calamus: {
      provider: () => new HDWalletProvider(mnemonic, `https://evm.calamus.finance`),
      network_id: 1281,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: "./contracts/",
  contracts_build_directory: "./src/abis/",
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    },
  },
};