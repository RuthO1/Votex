require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: '.env'});



module.exports = {
    networks: {
      hardhat: {
      },
      goerli: {
        url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        accounts: [process.env.PRIVATE_KEY.toString()]
      }
    },
    solidity: {
      version: "0.8.9",
    },
  }