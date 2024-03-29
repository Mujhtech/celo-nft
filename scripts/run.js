const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  
    const gameContract = await gameContractFactory.deploy(
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
  
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
  
    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();
  
    txn = await gameContract.attackBoss();
    await txn.wait();
  
    txn = await gameContract.attackBoss();
    await txn.wait();
  
    console.log("Done!");
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();
  