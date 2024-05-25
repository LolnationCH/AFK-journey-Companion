import { useEffect, useState } from "react";
import Layout from "./Layout";
import LayoutFetcher from "../libs/LayoutsFetcher";
import MapDiv from "./MapDiv";
import Loadout from "./Loadout";


export default function LayoutDiv() {
  // Load all the maps present in the assets/maps folder
  let [layouts, setLayouts] = useState<Layout[]>([]);

  useEffect(() => {
    LayoutFetcher.fetchLayouts().then((layouts) => {
      setLayouts(layouts);
    });
  }, []);

  const [selectedLayoutName, setSelectedLayoutName] = useState<string>("");
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  const [selectedLoadoutName, setSelectedLoadoutName] = useState<string>("");
  const [selectedLoadout, setSelectedLoadout] = useState<Loadout | null>(null);

  return (
    <div>
      <select value={selectedLayoutName} onChange={(e) => {
        setSelectedLayoutName(e.target.value);
        setSelectedLayout(layouts.find((layout) => layout.name === e.target.value) || null);
      }}>
        <option value="">Select a layout</option>
        {layouts.map((layout) => (
          <option key={layout.name} value={layout.name}>
            {layout.name}
          </option>
        ))}
      </select>

      {selectedLayout && (
        <div>
          <h1>{selectedLayoutName}</h1>
          <p>{selectedLayout.description}</p>
          <select value={selectedLoadoutName} onChange={(e) => {
            setSelectedLoadoutName(e.target.value);
            setSelectedLoadout(selectedLayout.loadouts.find((loadout) => loadout.name === e.target.value) || null);
          }}>
            <option value="">Select a loadout</option>
            {selectedLayout.loadouts.map((loadout) => (
              <option key={loadout.name} value={loadout.name}>
                {loadout.name}
              </option>
            ))}
          </select>
          <p></p>
          <MapDiv map={selectedLayout.map} loadout={selectedLoadout} />
          <p>{selectedLoadout?.artifact}</p>
        </div>
      )}
    </div>
  );
}