const hre = require("hardhat");

async function main() {
    const VotingContract = await hre.ethers.getContractFactory("VotingContract");
    const votingcontract = await VotingContract.deploy();

    await votingcontract.deployed();

    console.log("VotingContract deployed to:", votingcontract.address);
    storeContractData(votingcontract)
}

function storeContractData(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../src/contracts";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      contractsDir + "/VotingContract-address.json",
      JSON.stringify({ VotingContract: contract.address }, undefined, 2)
    );
  
    const VotingContractArtifact = artifacts.readArtifactSync("VotingContract");
  
    fs.writeFileSync(
      contractsDir + "/VotingContract.json",
      JSON.stringify(VotingContractArtifact, null, 2)
    );
  }


main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});