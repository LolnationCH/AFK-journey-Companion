import Map from '../../models/Map';
import GridCell, { EmptyGridCell } from './GridCell';
import Unit from '../../models/Unit';
import Loadout from '../../models/Loadout';

function getLoadoutOnPosition(loadout: Loadout | null, x: number, y: number): Unit {
  return loadout?.units.find(unit => unit.positionX === x && unit.positionY === y) || new Unit("", 0, x, y);
}

export default function MapDiv(props: { map: Map, loadout: Loadout | null, modifyLoadout: (unit: Unit) => void }) {
  const { map, loadout, modifyLoadout } = props;

  let i = 1;
  return (
    <div>
      {map.grid.map((row, y) => {
        let cellToSkip = map.getCellRowStart(y);
        return (
          <div key={y} style={{ marginLeft: `${y % 2 == 1 ? 0 : 40}px`, marginBottom: '-7px' }}>
            {new Array(cellToSkip).fill(0).map((_, i) => <EmptyGridCell key={i} />)}
            {row.map((value, x) => {
              if (value !== 0) {
                return <EmptyGridCell key={x} />;
              }
              return (
                <GridCell key={x} i={i++}
                  unit={getLoadoutOnPosition(loadout, x, y)}
                  modifyUnit={modifyLoadout} />
              )
            }
            )}
          </div>
        );
      }
      )}
    </div>
  );
}