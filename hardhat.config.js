require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

module.exports = {
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        rinkeby: {
          url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}` || "",
          accounts:
              process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        }
    },
    etherscan: {
        apiKey: process.env.ETH_API_KEY
    }
};