const CONTRACT_ADDRESS = '0x40F78D0cc7BE0383A277bB49D391034706711c45';

const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp,
      maxHp: characterData.maxHp,
      attackDamage: characterData.attackDamage,
    };
  };

export { CONTRACT_ADDRESS, transformCharacterData };