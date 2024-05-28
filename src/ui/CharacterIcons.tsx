import { memo } from "react";
import CharacterInfo from "../libs/CharacterInfo";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";

function CharacterIcons(props: { characters: CharacterInfo[], setSelectedCharacter: (character: CharacterInfo) => void }) {
  const { characters, setSelectedCharacter } = props;
  return (
    <>
      {characters.map((character) => (
        <div
          key={character.id}
          className="characters-cell"
          title={character.name === "" ? "Replace" : character.name}
          onClick={() => {
            CharacterInfoFetcher.selectCharacterInfo(character.name);
            setSelectedCharacter(character);
          }}
        >
          <img
            src={`./img/characters/${character.id}_sm.webp`}
            alt={character.name}
            style={{ maxHeight: "80px" }}
          />
        </div>
      ))}
    </>
  );
}

export default memo(CharacterIcons);