export const truncateAddress = (address) => {
  return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attackDamage: characterData.attackDamage,
  };
};
