import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { transformCharacterData } from "../../helpers";

import LoadingIndicator from "../LoadingIndicator";
import { useBalance } from "../../hooks/useBalance";
/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT, minterContract, address }) => {
  const [characters, setCharacters] = useState([]);
  /*
   * New minting state property we will be using
   */
  const [mintingCharacter, setMintingCharacter] = useState(false);

  const { blockNumber } = useBalance();

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await minterContract.methods
          .getAllDefaultCharacters()
          .call();
        // console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    /*
     * Add a callback method that will fire when this event is received
     */
    const onCharacterMint = async (err, contractEvent) => {
      if (err) {
        console.error("AttackComplete listener error", err);
        return;
      }

      const { sender, tokenId, characterIndex } = contractEvent;
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`
      );

      /*
       * Once our character NFT is minted we can fetch the metadata from our contract
       * and set it in state to move onto the Arena
       */
      if (minterContract) {
        const characterNFT = await minterContract.methods
          .checkIfUserHasNFT()
          .call();
        // console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    /*
     * If our gameContract is ready, let's get characters!
     */
    if (minterContract) {
      getCharacters();
      /*
       * Setup NFT Minted Listener
       */
      minterContract.events.CharacterNFTMinted(
        {
          filter: {
            myIndexedParam: [20, 23],
            myOtherIndexedParam: "0x123456789...",
          },
          fromBlock: 0,
        },
        onCharacterMint
      );

    }

    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (minterContract) {
        //minterContract.methods.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [minterContract]);

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img
          src={`https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv`}
          alt={character.name}
        />
        <button
          // type="button"
          className="character-mint-button"
          onClick={function () {
            //console.log("Minting character in progress...");
            mintCharacterNFTAction(index);
          }}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (minterContract) {
        setMintingCharacter(true);
        console.log("Minting character in progress...");
        const mintTxn = await minterContract.methods
          .mintCharacterNFT(characterId)
          .send({ from: address });
        console.log("mintTxn:", mintTxn);
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      setMintingCharacter(false);
    }
  };
  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
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
