// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const MyEpicGame = await hre.ethers.getContractFactory("MyEpicGame");
  const deployed = await MyEpicGame.deploy(
    ["Leo", "Aang", "Pikachu"],
    [
      "QmPasvfBzbDjPtgTL9bAF4nEJZQjf3J12bG4rrBfxUkLG4",
      "QmPasvfBzbDjPtgTL9bAF4nEJZQjf3J12bG4rrBfxUkLG4",
      "QmPasvfBzbDjPtgTL9bAF4nEJZQjf3J12bG4rrBfxUkLG4",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await deployed.deployed();

  console.log("MyEpicGame deployed to:", deployed.address);
  storeContractData(deployed);
}

function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/MyEpicGameAddress.json",
    JSON.stringify({ MyEpicGame: contract.address }, undefined, 2)
  );

  const MyNFTArtifact = artifacts.readArtifactSync("MyEpicGame");

  fs.writeFileSync(
    contractsDir + "/MyEpicGame.json",
    JSON.stringify(MyNFTArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
