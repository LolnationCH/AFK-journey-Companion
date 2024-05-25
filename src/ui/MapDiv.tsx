import Map from './Map';
import GridCell, { EmptyGridCell } from './GridCell';
import Unit from './Unit';
import Loadout from './Loadout';

function getLoadoutOnPosition(loadout: Loadout | null, x: number, y: number): Unit | null {
  return loadout?.units.find(unit => unit.positionX === x && unit.positionY === y) || null;
}

export default function MapDiv(props: { map: Map, loadout: Loadout | null }) {
  const { map, loadout } = props;
  let i = 1;
  return (
    <div>
      {map.grid.map((row, y) => {
        let cellToSkip = map.getCellRowStart(y);
        return (
          <div key={y} style={{ marginLeft: `${y % 2 == 1 ? 0 : 22}px`, marginBottom: '-7px' }}>
            {new Array(cellToSkip).fill(0).map((_, i) => <EmptyGridCell key={i} />)}
            {row.map((_, x) => (
              <GridCell key={x} i={i++} unit={getLoadoutOnPosition(loadout, x, y)} />
            ))}
          </div>
        );
      }
      )}
    </div>
  );
}