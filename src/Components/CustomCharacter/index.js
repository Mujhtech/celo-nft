import React, { useState } from "react";
import { uploadToIpfs } from "../../utils/minter";
import "./CustomCharacter.css";

export default function CustomCharacter({ addNFT, mintingCharacter }) {
  const [name, setName] = useState("");
  const [imageURI, setImageURI] = useState("");
  const [hp, setHp] = useState(0);
  const [attackDamage, setAttackDamage] = useState(0);
  const [maxHp, setMaxHp] = useState(0);

  return (
    <div className="custom-character">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          addNFT(name, hp, maxHp, attackDamage, imageURI);
        }}
      >
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>HP</label>
          <input
            type="number"
            name="hp"
            onChange={(e) => setHp(e.target.value)}
          />
        </div>
        <div>
          <label>Max Hp</label>
          <input
            type="number"
            name="max-hp"
            onChange={(e) => setMaxHp(e.target.value)}
          />
        </div>
        <div>
          <label>Attack Damagae</label>
          <input
            type="number"
            name="attack-damage"
            onChange={(e) => setAttackDamage(e.target.value)}
          />
        </div>
        <div>
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            onChange={async (e) => {
              const imageUrl = await uploadToIpfs(e);
              if (!imageUrl) {
                alert("failed to upload image");
                return;
              }
              setImageURI(imageUrl);
            }}
          />
        </div>
        <div>
          <button
            disabled={mintingCharacter}
            onClick={async (e) => {
              e.preventDefault();
              addNFT(name, hp, maxHp, attackDamage, imageURI);
            }}
          >
            Mint Hero
          </button>
        </div>
      </form>
    </div>
  );
}
