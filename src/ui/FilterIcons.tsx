export default function FilterIcons(props: { sortFunction: (name: string) => void, filter: string[], items: { name: string, image: string }[] }) {
  const { sortFunction, filter, items } = props;
  return (<div>
    {items.map((item) => (
      <div
        key={item.name}
        className="faction-icon"
        onClick={() => sortFunction(item.name)}
      >
        <img
          style={{
            border: filter.includes(item.name) ? "1px solid #d89bdf" : "",
          }}
          src={item.image}
          alt={item.name} />
      </div>
    ))}
  </div>);
}