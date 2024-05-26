import { useEffect, useState } from "react";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";
import CharacterInfo from "../libs/CharacterInfo";

const factionToAbrev: { [key: string]: string; } = {
  "cele": "Celestial",
  "grave": "Graveborn",
  "hypo": "Hypogean",
  "light": "Lightbearer",
  "mauler": "Mauler",
  "wilder": "Wilder",
};
const classToAbrev: { [key: string]: string; } = {
  "mage": "Mage",
  "mark": "Marksman",
  "rogue": "Rogue",
  "support": "Support",
  "tank": "Tank",
  "warrior": "Warrior",
};
function modifyCharacterList(characters: CharacterInfo[]) {
  // Check if characters already have the null character
  if (characters.length > 0 && characters[0].name === "") {
    return characters;
  }

  // Add null character
  characters.push(new CharacterInfo("", "0", "", ""));
  characters.sort((a, b) => a.name.localeCompare(b.name));
  return characters;
}
export function CharacterList() {
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [charactersList, setCharactersList] = useState<CharacterInfo[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<string>("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("");

  useEffect(() => {
    if (charactersList.length > 0) {
      let characters = modifyCharacterList(charactersList);
      setCharacters(characters);
      return;
    }

    CharacterInfoFetcher.fetchCharacterInfo().then((charactersReceived) => {
      setCharactersList(charactersReceived);
      setCharacters(modifyCharacterList(charactersReceived));
    });
  }, []);

  const sortBasedOnFaction = (factionName: string) => {
    setSelectedFactionFilter(factionName);
    if (selectedClassFilter !== "") {
      let factionCharacters = charactersList.filter((character) => character.type === factionToAbrev[factionName] && character.class === classToAbrev[selectedClassFilter]);
      setCharacters(modifyCharacterList(factionCharacters));
      return;
    }
    let factionCharacters = charactersList.filter((character) => character.type === factionToAbrev[factionName]);
    setCharacters(modifyCharacterList(factionCharacters));
  };

  const sortBasedOnClass = (className: string) => {
    setSelectedClassFilter(className);
    if (selectedFactionFilter !== "") {
      let classCharacters = charactersList.filter((character) => character.type === factionToAbrev[selectedFactionFilter] && character.class === classToAbrev[className]);
      setCharacters(modifyCharacterList(classCharacters));
      return;
    }
    let classCharacters = charactersList.filter((character) => character.class === classToAbrev[className]);
    setCharacters(modifyCharacterList(classCharacters));
  };

  return (
    <div style={{ overflow: "auto" }}>
      <div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("cele")}><img src="./img/factions/faction_cele.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("grave")}><img src="./img/factions/faction_grave.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("hypo")}> <img src="./img/factions/faction_hypo.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("light")}> <img src="./img/factions/faction_light.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("mauler")}><img src="./img/factions/faction_mauler.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnFaction("wilder")}><img src="./img/factions/faction_wilder.webp"></img></div>
        <div className="faction-icon" onClick={() => { setCharacters(charactersList); setSelectedFactionFilter("") }}><img src="./img/factions/faction_all.webp"></img></div>
        <span>Currently selected character : {selectedCharacter?.name}</span>
      </div>
      <div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("mage")}><img src="./img/class/class_mage.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("mark")}><img src="./img/class/class_mark.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("rogue")}><img src="./img/class/class_rogue.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("support")}><img src="./img/class/class_support.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("tank")}><img src="./img/class/class_tank.webp"></img></div>
        <div className="faction-icon" onClick={() => sortBasedOnClass("warrior")}><img src="./img/class/class_warrior.webp"></img></div>
        <div className="faction-icon" onClick={() => { setCharacters(charactersList); setSelectedClassFilter("") }}><img src="./img/class/class_all.webp"></img></div>
      </div>
      {characters.map((character, _) => (
        <div key={character.id} className="characters-cell" onClick={() => {
          CharacterInfoFetcher.selectCharacterInfo(character.name);
          setSelectedCharacter(character);
        }}>
          <img src={`./img/characters/${character.id}_sm.webp`} alt={character.name} style={{ maxHeight: "80px" }} />
        </div>
      ))}
    </div>
  );
}
