import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { ethers } from "ethers";
import { transformCharacterData } from "../constants";

// initialize IPFS
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

// mint an NFT
export const createNft = async (
  minterContract,
  performActions,
  name,
  hp,
  maxHp,
  attackDamage,
  imageURI
) => {
  await performActions(async (kit) => {
    if (!name || !hp || !maxHp || !attackDamage || !imageURI) return;
    const { defaultAccount } = kit;

    try {
      // mint the NFT and save the IPFS url to the blockchain
      let transaction = await minterContract.methods
        .mintCharacterNFT(0, name, imageURI, hp, maxHp, attackDamage)
        .send({ from: defaultAccount });

      return transaction;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  });
};

// function to upload a file to IPFS
export const uploadToIpfs = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export const getAllCharacters = async (minterContract) => {
  try {
    const charactersTxn = await minterContract.methods
      .getAllDefaultCharacters()
      .call();

    const characters = charactersTxn.map((characterData) =>
      transformCharacterData(characterData)
    );

    return characters;
  } catch (e) {
    console.log({ e });
  }
};

export const getCharacterNFT = async (minterContract) => {
  try {
    const characterNFT = await minterContract.methods
      .checkIfUserHasNFT()
      .call();
    return characterNFT;
  } catch (e) {
    console.log({ e });
  }
};

export const attackBoss = async (minterContract) => {
  try {
    const attack = await minterContract.methods.attackBoss().call();
    return attack;
  } catch (error) {
    console.log({ error });
  }
};
