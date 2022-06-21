import React, { useEffect, useState } from "react";
import { transformCharacterData } from "../../constants";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";
import { attackBoss, getCharacterNFT } from "../../utils/minter";
import { useContractKit } from "@celo-tools/use-contractkit";

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT, minterContract, address }) => {
  /*
   * State that will hold our boss metadata
   */
  const [boss, setBoss] = useState(null);

  const { performActions } = useContractKit();

  /*
   * We are going to use this to add a bit of fancy animations during attacks
   */
  const [attackState, setAttackState] = useState("");

  const [showToast, setShowToast] = useState(false);

  const onAttackComplete = async () => {
    const character = await getCharacterNFT(minterContract);
    setCharacterNFT(transformCharacterData(character));

    const bossTxn = await minterContract.methods.getBigBoss().call();
    setBoss(transformCharacterData(bossTxn));
  };

  // UseEffects
  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await minterContract.methods.getBigBoss().call();
      setBoss(transformCharacterData(bossTxn));
    };

    if (minterContract && boss == null) {
      fetchBoss();
    }
  }, [minterContract]);

  const runAttackAction = async () => {
    try {
      if (minterContract) {
        setAttackState("attacking");
        await attackBoss(minterContract, performActions);
        setAttackState("hit");
        await onAttackComplete();
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      {/* Boss */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "attacking" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
      )}

      {/* Replace your Character UI with this */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
