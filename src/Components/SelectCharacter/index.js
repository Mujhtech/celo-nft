import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { transformCharacterData } from "../../constants";
import { useContractKit } from "@celo-tools/use-contractkit";
import LoadingIndicator from "../LoadingIndicator";
import CustomCharacter from "../CustomCharacter";
import { createNft, getCharacterNFT } from "../../utils/minter";
/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT, minterContract, address }) => {
  const { performActions } = useContractKit();
  /*
   * New minting state property we will be using
   */
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const [customHero, setCustomHero] = useState(true);

  const addNFT = async (name, hp, maxHp, attackDamage, imageURI) => {
    try {
      if (minterContract) {
        setMintingCharacter(true);
        await createNft(
          minterContract,
          performActions,
          name,
          hp,
          maxHp,
          attackDamage,
          imageURI
        );
        const character = await getCharacterNFT(minterContract);
        setCharacterNFT(transformCharacterData(character));
        setMintingCharacter(false);
      }
    } catch (e) {
      setMintingCharacter(false);
      console.log(e);
      alert("Failed to mint character");
    }
  };

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {customHero && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CustomCharacter
            addNFT={addNFT}
            mintingCharacter={mintingCharacter}
          />
        </div>
      )}

      {/* Only show our loading state if mintingCharacter is true */}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;
