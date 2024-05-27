import Map from './Map';
import GridCell, { EmptyGridCell } from './GridCell';
import Unit from './Unit';
import Loadout from './Loadout';
import { useState } from 'react';

function getLoadoutOnPosition(loadout: Loadout | null, x: number, y: number): Unit {
  return loadout?.units.find(unit => unit.positionX === x && unit.positionY === y) || new Unit("", 0, x, y);
}

export default function MapDiv(props: { map: Map, loadout: Loadout | null, modifyLoadout: (loadout: Loadout) => void }) {
  const { map, loadout, modifyLoadout } = props;
  const [unitsState, setUnitsState] = useState<Unit[]>(loadout?.units || []);

  let modifyUnit = (unit: Unit) => {
    if (!loadout) return;

    let newUnits = unitsState.filter(u => u.positionX !== unit.positionX || u.positionY !== unit.positionY);
    newUnits.push(unit);
    setUnitsState(newUnits);
    loadout.units = newUnits;
    modifyLoadout(loadout);
  }

  let i = 1;
  return (
    <div>
      {map.grid.map((row, y) => {
        let cellToSkip = map.getCellRowStart(y);
        return (
          <div key={y} style={{ marginLeft: `${y % 2 == 1 ? 0 : 22}px`, marginBottom: '-7px' }}>
            {new Array(cellToSkip).fill(0).map((_, i) => <EmptyGridCell key={i} />)}
            {row.map((_, x) => (
              <GridCell key={x} i={i++} unit={getLoadoutOnPosition(loadout, x, y)} modifyUnit={modifyUnit} />
            ))}
          </div>
        );
      }
      )}
    </div>
  );
}