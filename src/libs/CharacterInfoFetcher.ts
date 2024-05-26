import CharacterInfo from "./CharacterInfo";

let characterInfo: CharacterInfo[] | null = null;

let currentSelectedCharacter: CharacterInfo | null = null;

export default class CharacterInfoFetcher {

  static fetchCharacterInfo(): Promise<CharacterInfo[]> {
    if (characterInfo) {
      return Promise.resolve(characterInfo);
    }

    return fetch("./characters.json")
      .then((response) => response.json())
      .then((data) => {
        characterInfo = CharacterInfo.fromJsonArray(data);
        return characterInfo;
      });
  }

  static async selectCharacterInfo(name: string) {
    if (!characterInfo) {
      await CharacterInfoFetcher.fetchCharacterInfo();
    }

    currentSelectedCharacter = characterInfo?.find((c) => c.name === name) || null;
  }

  static getSelectedCharacterInfo(): CharacterInfo | null {
    return currentSelectedCharacter;
  }
}
