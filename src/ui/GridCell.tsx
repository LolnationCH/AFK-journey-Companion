import { useState, useEffect } from "react";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";
import Unit from "./Unit";

export default function GridCell(props: { i: number, unit: Unit, modifyUnit: (unit: Unit) => void }) {
  const { i, unit, modifyUnit } = props;
  let content = i < 10 ? `0${i}` : i;
  const [unitId, setUnitId] = useState("0");

  useEffect(() => {
    fetchCharacterId(unit, setUnitId);
  }, [unit]);

  const onClickCell = () => {
    let newUnit = CharacterInfoFetcher.getSelectedCharacterInfo();

    if (newUnit === null) {
      unit.name = "";
    } else {
      unit.name = newUnit.name;
    }
    modifyUnit(unit);
    fetchCharacterId(unit, setUnitId);
  };
  return (
    <>
      {(unit && unitId !== "0") &&
        <div
          className='grid-cell'
          onClick={onClickCell}
          style={{ color: 'transparent', backgroundImage: `url(./img/characters/${unitId}_sm.webp)` }}>
          {content}
        </div>}
      {!(unit && unitId !== "0") &&
        <div className='grid-cell' onClick={onClickCell}>
          {content}
        </div>}
    </>
  );
}

function fetchCharacterId(unit: Unit | null, setUnitId: (id: string) => void) {
  CharacterInfoFetcher.fetchCharacterInfo().then((characterInfo) => {
    if (unit) {
      const character = characterInfo.find((c) => c.name === unit.name);
      if (character) {
        setUnitId(character.id);
      }
      else {
        setUnitId("0");
      }
    }
  });
}

export function EmptyGridCell() {
  return (
    <div className='empty-grid-cell'>
      00
    </div>
  );
}