import { useEffect, useState } from "react";
import Layout from "./Layout";
import LayoutFetcher from "../libs/LayoutsFetcher";
import MapDiv from "./MapDiv";
import Loadout from "./Loadout";

import { CharacterList } from "./CharacterList";
import ArtifactInfo from "../libs/ArtifactInfo";
import ArtifactInfoFetcher from "../libs/ArtifactInfoFetcher";

export default function LayoutDiv() {
  let [layouts, setLayouts] = useState<Layout[]>([]);

  useEffect(() => {
    LayoutFetcher.fetchLayouts().then((layoutsFetched) => {
      setLayouts(layoutsFetched);
    });
  }, []);

  const [selectedLayoutName, setSelectedLayoutName] = useState<string>("");
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  const [selectedLoadoutName, setSelectedLoadoutName] = useState<string>("");
  const [selectedLoadout, setSelectedLoadout] = useState<Loadout | null>(null);

  const [artifacts, setArtifacts] = useState<ArtifactInfo[]>([]);
  const [seasonalArtifacts, setSeasonalArtifacts] = useState<ArtifactInfo[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactInfo | null>(null);

  let modifyLoadout = (loadout: Loadout) => {
    if (!selectedLayout || !selectedLoadout) return;
    let newLoadouts = selectedLayout.loadouts.filter(l => l.name !== selectedLoadout?.name);
    newLoadouts.push(loadout);
    selectedLayout.loadouts = newLoadouts;
    setSelectedLayout(selectedLayout);
    setSelectedLoadoutName(loadout.name);
  }

  const renameLoadout = () => {
    let newName = prompt("New name for loadout : ");
    if (!newName || !selectedLoadout) return;
    let temp = selectedLoadout;
    temp.name = newName;
    modifyLoadout(temp);
  };

  return (
    <>
      <h1>Composition builder</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr" }}>
        <div>
          <span>
            <span>Layout Selection : </span>
            <select
              value={selectedLayoutName}
              onChange={(e) => {
                setSelectedLayoutName(e.target.value);
                let layout = layouts.find((layout) => layout.name === e.target.value) || null;
                setSelectedLayout(layout);
                setLayout(layout?.loadouts[0] || null);
                setSelectedLoadoutName(layout?.loadouts[0].name || "");
              }}
            >
              <option value="">Select a layout</option>
              {layouts.map((layout) => (
                <option key={layout.name} value={layout.name}>
                  {layout.name}
                </option>
              ))}
            </select>
          </span>

          {selectedLayout && (
            <div>
              <span>{selectedLayout.description}</span>
              <span>
                <span>Loadout Selection : </span>
                <select
                  value={selectedLoadoutName}
                  onChange={(e) => {
                    SetSelectedLayoutOnChange(e.target.value);
                  }}
                >
                  <option value="">Select a loadout</option>
                  {selectedLayout.loadouts.map((loadout) => (
                    <option key={loadout.name} value={loadout.name}>
                      {loadout.name}
                    </option>
                  ))}
                </select>
              </span>
              <p></p>
              <div>
                <span className="layout-button">Add +</span>
                <span className="layout-button" onClick={renameLoadout}>Rename ✏️</span>
                <span className="layout-button" onClick={() => {
                  if (!selectedLayout || !selectedLoadout) return;
                  LayoutFetcher.saveLayout(selectedLayout);
                }}>Save 💾</span>
              </div>
              <p></p>
              <MapDiv map={selectedLayout.map} loadout={selectedLoadout} modifyLoadout={setSelectedLoadout} />
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr" }}>
                <img src={`./img/artifacts/arti_${selectedArtifact?.id}.webp`} title={`${selectedArtifact?.name}`} />
                <select
                  value={selectedArtifact?.name}
                  onChange={(e) => {
                    let findArtifact = artifacts.find((artifact) => artifact.name === e.target.value);
                    if (!findArtifact) {
                      findArtifact = seasonalArtifacts.find((artifact) => artifact.name === e.target.value);
                    }
                    setSelectedArtifact(findArtifact || null);
                  }}
                  className="artifact-select"
                  style={{ maxHeight: "50%", alignSelf: "center" }}
                >
                  {artifacts.map((artifact) => (
                    <option key={artifact.name} value={artifact.name}>
                      {artifact.name}
                    </option>
                  ))}
                  <option disabled>────Seasonal────</option>
                  {seasonalArtifacts.map((artifact) => (
                    <option key={artifact.name} value={artifact.name}>
                      {artifact.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        <div>
          <h2>Characters Selection</h2>
          {CharacterList()}
        </div>
      </div>
    </>
  );

  function SetSelectedLayoutOnChange(name: string) {
    setSelectedLoadoutName(name);
    setLayout(selectedLayout?.loadouts.find((loadout) => loadout.name === name) || null);
  }


  function setLayout(loadout: Loadout | null) {
    setSelectedLoadout(loadout);
    ArtifactInfoFetcher.fetchArtifactInfo().then((artifactsFetched) => {
      artifactsFetched.sort((a, b) => a.name > b.name ? 1 : -1);
      setArtifacts(artifactsFetched);
      let temp = artifactsFetched.find((artifact) => artifact.name === loadout?.artifact);
      if (temp) {
        setSelectedArtifact(temp);
      }
    });
    ArtifactInfoFetcher.fetchSeasonalArtifactInfo().then((artifactsFetched) => {
      artifactsFetched.sort((a, b) => a.name > b.name ? 1 : -1);
      setSeasonalArtifacts(artifactsFetched);
      let temp = artifactsFetched.find((artifact) => artifact.name === loadout?.artifact);
      if (temp) {
        setSelectedArtifact(temp);
      }
    });
  }
}