import { useEffect, useState, memo } from "react";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";
import CharacterInfo from "../libs/CharacterInfo";
import FilterIcons from "./FilterIcons";
import CharacterIcons from "./CharacterIcons";

const factions = [
  { name: "Celestial", image: "./img/factions/faction_cele.webp" },
  { name: "Graveborn", image: "./img/factions/faction_grave.webp" },
  { name: "Hypogean", image: "./img/factions/faction_hypo.webp" },
  { name: "Lightbearer", image: "./img/factions/faction_light.webp" },
  { name: "Mauler", image: "./img/factions/faction_mauler.webp" },
  { name: "Wilder", image: "./img/factions/faction_wilder.webp" },
  { name: "All", image: "./img/factions/faction_all.webp" },
];

const classes = [
  { name: "Mage", image: "./img/class/class_mage.webp" },
  { name: "Marksman", image: "./img/class/class_mark.webp" },
  { name: "Rogue", image: "./img/class/class_rogue.webp" },
  { name: "Support", image: "./img/class/class_support.webp" },
  { name: "Tank", image: "./img/class/class_tank.webp" },
  { name: "Warrior", image: "./img/class/class_warrior.webp" },
  { name: "All", image: "./img/class/class_all.webp" },
];

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
function CharacterList() {
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [charactersList, setCharactersList] = useState<CharacterInfo[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<string[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string[]>([]);

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


  const _sortBasedOnFactionAndClass = sortBasedOnFactionAndClass(setSelectedFactionFilter, setSelectedClassFilter, charactersList, setCharacters);
  const _sortBasedOnClass = sortBasedOnClass(_sortBasedOnFactionAndClass, selectedFactionFilter, selectedClassFilter, setSelectedClassFilter);
  const _sortBasedOnFaction = sortBasedOnFaction(_sortBasedOnFactionAndClass, selectedClassFilter, selectedFactionFilter, setSelectedFactionFilter);

  return (
    <div style={{ overflow: "auto" }}>
      <FilterIcons sortFunction={_sortBasedOnFaction} filter={selectedFactionFilter} items={factions} />
      <FilterIcons sortFunction={_sortBasedOnClass} filter={selectedClassFilter} items={classes} />
      <div>Currently selected character : {selectedCharacter?.name}</div>
      <CharacterIcons characters={characters} setSelectedCharacter={setSelectedCharacter} />
    </div>
  );
}

function sortBasedOnFactionAndClass(
  setSelectedFactionFilter: (factionNameFilter: string[]) => void,
  setSelectedClassFilter: (classNameFilter: string[]) => void,
  charactersList: CharacterInfo[],
  setCharacters: (characters: CharacterInfo[]) => void) {
  return (factionNameFilter: string[], classNameFilter: string[]) => {
    setSelectedFactionFilter(factionNameFilter);
    setSelectedClassFilter(classNameFilter);

    let filteredCharacters = charactersList.filter((character) => {
      if (factionNameFilter.length > 0 && !factionNameFilter.includes(character.type)) {
        return false;
      }
      if (classNameFilter.length > 0 && !classNameFilter.includes(character.class)) {
        return false;
      }
      return true;
    });

    setCharacters(modifyCharacterList(filteredCharacters));
  };
}

function sortBasedOnClass(
  sortBasedOnFactionAndClass: (factionNameFilter: string[], classNameFilter: string[]) => void,
  selectedFactionFilter: string[],
  selectedClassFilter: string[],
  setSelectedClassFilter: (classNameFilter: string[]) => void) {
  return (className: string) => {
    if (className === "All") {
      sortBasedOnFactionAndClass(selectedFactionFilter, []);
      return;
    }
    let temp = [...selectedClassFilter];
    if (!temp.includes(className)) {
      temp.push(className);
    }
    else {
      temp = temp.filter((c) => c !== className);
    }
    setSelectedClassFilter(temp);
    sortBasedOnFactionAndClass(selectedFactionFilter, temp);
  };
}

function sortBasedOnFaction(
  sortBasedOnFactionAndClass: (factionNameFilter: string[], classNameFilter: string[]) => void,
  selectedClassFilter: string[],
  selectedFactionFilter: string[],
  setSelectedFactionFilter: (factionNameFilter: string[]) => void) {
  return (factionName: string) => {
    if (factionName === "All") {
      sortBasedOnFactionAndClass([], selectedClassFilter);
      return;
    }
    let temp = [...selectedFactionFilter];
    if (!temp.includes(factionName)) {
      temp.push(factionName);
    }
    else {
      temp = temp.filter((c) => c !== factionName);
    }
    setSelectedFactionFilter(temp);
    sortBasedOnFactionAndClass(temp, selectedClassFilter);
  };
}

export default memo(CharacterList);
