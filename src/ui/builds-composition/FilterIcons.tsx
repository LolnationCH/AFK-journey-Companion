
import { memo } from "react";

const Icon = memo((props: { name: string, image: string, filter: string[] }) => {
  return (
    <>
      <img
        style={{
          border: props.filter.includes(props.name) ? "1px solid #d89bdf" : "",
        }}
        src={props.image}
        title={props.name}
        alt={props.name} />
    </>
  );
});

function FilterIcons(props: { sortFunction: (name: string) => void, filter: string[], items: { name: string, image: string }[] }) {
  const { sortFunction, filter, items } = props;
  return (<div>
    {items.map((item) => (
      <div
        key={item.name}
        className="faction-icon"
        onClick={() => sortFunction(item.name)}
      >
        <Icon name={item.name} image={item.image} filter={filter} />
      </div>
    ))}
  </div>);
}

export default memo(FilterIcons);