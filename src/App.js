import React, { useState, useEffect } from "react";
import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import "./App.css";
import { transformCharacterData } from "./helpers";
import LoadingIndicator from "./Components/LoadingIndicator";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useMinterContract } from "./hooks";
import {truncateAddress} from "./helpers";

const App = () => {
  const { address, connect } = useContractKit();

  const minterContract = useMinterContract();

  /*
   * Right under current account, setup this new state property
   */
  const [characterNFT, setCharacterNFT] = useState(null);

  /*
   * New state property added here
   */
  const [isLoading, setIsLoading] = useState(false);

  // Render Methods
  const renderContent = () => {
    /*
     * If the app is currently loading, just render out LoadingIndicator
     */
    if (isLoading) {
      return <LoadingIndicator />;
    }

    /*
     * Scenario #1
     */
    if (!address) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connect}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (address && !characterNFT) {
      return (
        <SelectCharacter
          setCharacterNFT={setCharacterNFT}
          minterContract={minterContract}
          address={address}
        />
      );
      /*
       * If there is a connected wallet and characterNFT, it's time to battle!
       */
    } else if (address && characterNFT) {
      return (
        <Arena
          characterNFT={characterNFT}
          setCharacterNFT={setCharacterNFT}
          address={address}
          minterContract={minterContract}
        />
      );
    }
  };


  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", address);

      const characterNFT = await minterContract.methods
        .checkIfUserHasNFT()
        .call();
      if (characterNFT.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(characterNFT));
      } else {
        console.log("No character NFT found");
      }

      const allCharacters = await minterContract.methods
        .getAllDefaultCharacters()
        .call();
      console.log("All characters:", allCharacters);

      setIsLoading(false);
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (address && minterContract) {
      console.log("CurrentAccount:", address);
      fetchNFTMetadata();
    }
  }, [minterContract]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="header gradient-text">⚔️ Metaverse Ninja ⚔️</p>
              <p className="sub-text">Team up to protect the Metaverse!</p>
            </div>
            <div className="right">
              <img
                alt="Celo logo"
                className="logo"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjM3NiAyNTAgMzIwMCA5NTAiPjxwYXRoIGQ9Ik0yODE3IDEwODlsODYtMjdWMzUwbC04NiAyN3ptLTk5Mi00MzJjNTQgMCAxMDQgMjQgMTM2IDY0bDM1LTgxYy00Ni00NC0xMDctNjUtMTcxLTY1LTE0OCAwLTI1MCAxMTctMjQ5IDI0NiAxIDE0MCAxMTEgMjU0IDI0OSAyNTQgNzAgMCAxMjMtMjEgMTYzLTUwdi05OWMtNDIgNDItMTAzIDY3LTE1NiA2Ny04MCAwLTE3MC02NS0xNzAtMTcyIDAtOTkgNzgtMTY0IDE2My0xNjR6bTU3Mi04MmMtMTQ4IDAtMjM0IDExNy0yMzQgMjQ2IDAgMTQwIDExMSAyNTQgMjQ5IDI1NCA3MCAwIDEyMy0yMSAxNjMtNTB2LTk5Yy00MiA0Mi0xMDMgNjctMTU2IDY3LTcxIDAtMTQ5LTQ0LTE2NS0xMzdoMzc3di0zM2MwLTEzOC05MS0yNDgtMjM0LTI0OHptOTI5IDBhMjUwIDI1MCAwIDAwMCA1MDAgMjUwIDI1MCAwIDAwMC01MDB6bS05MjggODJjNjcgMCAxMzggNDIgMTQ0IDEyM2gtMjg4YzYtODEgNzctMTIzIDE0NC0xMjN6bTkyOCAzMzZhMTY4IDE2OCAwIDExMTY4LTE2OCAxNjcuNyAxNjcuNyAwIDAxLTE2OCAxNjh6IiBmaWxsPSIjMmUzMzM4Ij48L3BhdGg+PHBhdGggZD0iTTc1MSAxMTAwYTI3NSAyNzUgMCAxMDAtNTUwIDI3NSAyNzUgMCAwMDAgNTUwem0wIDEwMGEzNzUgMzc1IDAgMTEwLTc1MCAzNzUgMzc1IDAgMDEwIDc1MHoiIGZpbGw9IiNmYmNjNWMiPjwvcGF0aD48cGF0aCBkPSJNOTUxIDkwMGEyNzUgMjc1IDAgMTAwLTU1MCAyNzUgMjc1IDAgMDAwIDU1MHptMCAxMDBhMzc1IDM3NSAwIDExMC03NTAgMzc1IDM3NSAwIDAxMCA3NTB6IiBmaWxsPSIjMzVkMDdmIj48L3BhdGg+PHBhdGggZD0iTTk2My4zIDk5OS44YTI3NC4xIDI3NC4xIDAgMDA1NC41LTEwOCAyNzQuMiAyNzQuMiAwIDAwMTA4LTU0LjUgMzczLjMgMzczLjMgMCAwMS0yOS4xIDEzMy4zIDM3My4zIDM3My4zIDAgMDEtMTMzLjQgMjkuMnpNNjg0LjIgNTU4LjJhMjc0LjIgMjc0LjIgMCAwMC0xMDggNTQuNSAzNzMuMyAzNzMuMyAwIDAxMjkuMS0xMzMuNCAzNzMuMyAzNzMuMyAwIDAxMTMzLjQtMjkuMSAyNzQuMiAyNzQuMiAwIDAwLTU0LjUgMTA4eiIgZmlsbD0iIzVlYTMzYiI+PC9wYXRoPjwvc3ZnPg=="
              />
              {address ? (
                <p>
                  {" "}
                  Wallet: {truncateAddress(address)}
                </p>
              ) : (
                <p> Not connected </p>
              )}
            </div>
          </header>
        </div>
        <div className="connect-wallet-container">{renderContent()}</div>
      </div>
    </div>
  );
};

export default App;
