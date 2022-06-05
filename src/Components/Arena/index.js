import React, { useEffect, useState } from "react";
import { transformCharacterData } from "../../helpers";
import "./Arena.css";
import LoadingIndicator from "../LoadingIndicator";
import { useBalance } from "../../hooks/useBalance";

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT, minterContract, address }) => {
  /*
   * State that will hold our boss metadata
   */
  const [boss, setBoss] = useState(null);

  /*
   * We are going to use this to add a bit of fancy animations during attacks
   */
  const [attackState, setAttackState] = useState("");

  const [showToast, setShowToast] = useState(false);

  const { blockNumber } = useBalance();

  // UseEffect to fetch the boss metadata
  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await minterContract.methods.getBigBoss().call();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };

    /*
     * Setup logic when this event is fired off
     */
    const onAttackComplete = (err, contractEvent) => {
      console.log(`Listener fired: onAttackComplete`);
      if (err) {
        console.error("AttackComplete listener error", err);
        return;
      }
      const { from, newBossHp, newPlayerHp } = contractEvent;
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();
      const sender = from.toString();

      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      /*
       * If player is our own, update both player and boss Hp
       */
      if (address === sender.toLowerCase()) {
        setBoss((prevState) => {
          return { ...prevState, hp: bossHp };
        });
        setCharacterNFT((prevState) => {
          return { ...prevState, hp: playerHp };
        });
      } else {
        /*
         * If player isn't ours, update boss Hp only
         */
        setBoss((prevState) => {
          return { ...prevState, hp: bossHp };
        });
      }
    };

    if (minterContract) {
      fetchBoss();
      minterContract.events.AttackComplete(
        {
          fromBlock: 0,
        },
        onAttackComplete
      );

    }

    /*
     * Make sure to clean up this event when this component is removed
     */
    return () => {
      if (minterContract) {
        // minterContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [minterContract]);

  const runAttackAction = async () => {
    try {
      if (minterContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await minterContract.methods.attackBoss().call();
        //await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");

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
                  src={`https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv`}
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
