import { useState, useEffect, useCallback, memo } from "react";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";
import { BaseDirectory, readBinaryFile, exists } from '@tauri-apps/api/fs';
import Unit from "./Unit";

function DivImage(props: { unitId: string, onClickCell: () => void, content: string }) {
  const { unitId, onClickCell, content } = props;
  const [urlStr, setUrlStr] = useState(`./img/characters/${unitId}_sm.webp`);
  // Check if the image exists in the local data directory
  useEffect(() => {
    let filePath = `data/img/characters/${unitId}_sm.webp`;
    exists(filePath, { dir: BaseDirectory.AppLocalData }).then((fileExists) => {
      if (fileExists) {
        return readBinaryFile(filePath, { dir: BaseDirectory.AppLocalData }).then((data) => {
          let base64Str = btoa(String.fromCharCode(...new Uint8Array(data)));
          setUrlStr(`data:image/webp;base64,${base64Str}`);
        });
      }
      else {
        setUrlStr(`./img/characters/${unitId}_sm.webp`);
      }
    });
  }, [unitId]);

  return (
    <div
      className='grid-cell'
      onClick={onClickCell}
      style={{ color: 'transparent', backgroundImage: `url('${urlStr}')` }}>
      {content}
    </div>
  )
}

export default memo(function GridCell(props: { i: number, unit: Unit, modifyUnit: (unit: Unit) => void }) {
  const { i, unit, modifyUnit } = props;
  let content = i < 10 ? `0${i}` : `${i}`;
  const [unitId, setUnitId] = useState("0");

  const onClickCell = useCallback(() => {
    let newUnit = CharacterInfoFetcher.getSelectedCharacterInfo();

    if (newUnit === null) {
      unit.name = "";
    } else {
      unit.name = newUnit.name;
    }
    modifyUnit(unit);
    fetchCharacterId(unit, setUnitId);
  }, [unit, modifyUnit, fetchCharacterId, setUnitId]);

  useEffect(() => {
    fetchCharacterId(unit, setUnitId);
  }, [unit]);

  return (
    <>
      {(unit && unitId !== "0") &&
        <DivImage unitId={unitId} onClickCell={onClickCell} content={content} />}
      {!(unit && unitId !== "0") &&
        <div className='grid-cell' onClick={onClickCell}>
          {content}
        </div>}
    </>
  );
});

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