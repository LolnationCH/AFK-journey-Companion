import Unit from "./Unit";

export default function GridCell(props: { i: number, unit: Unit | null }) {
  const { i, unit } = props;
  let content = i < 10 ? `0${i}` : i;
  return (
    <>
      {unit && <div className='grid-cell' style={{ color: 'transparent', backgroundImage: `url(./img/characters/${unit.name.toLowerCase()}.webp)` }}>{content}</div>}
      {!unit && <div className='grid-cell'>{content}</div>}
    </>
  );
}

export function EmptyGridCell() {
  return (
    <div className='empty-grid-cell'>
      00
    </div>
  );
}