import { useEffect, useState, memo } from "react";
import Layout from "./Layout";
import LayoutFetcher from "../libs/LayoutsFetcher";
import MapDiv from "./MapDiv";
import Loadout, { ArtifactType } from "./Loadout";

import CharacterList from "./CharacterList";
import ArtifactInfo from "../libs/ArtifactInfo";
import ArtifactInfoFetcher from "../libs/ArtifactInfoFetcher";
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri'
import Unit from "./Unit";
import CharacterInfoFetcher from "../libs/CharacterInfoFetcher";
import getAppLocalDataDirPath from "./LocalDataDirPath";
import ArtifactImage from "./ArtifactImage";

export default function LayoutDiv() {
  const [listVisible, setListVisible] = useState<boolean>(true);

  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayoutName, setSelectedLayoutName] = useState<string>("");
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  const [selectedLoadoutName, setSelectedLoadoutName] = useState<string>("");
  const [selectedLoadout, setSelectedLoadout] = useState<Loadout | null>(null);

  const [artifacts, setArtifacts] = useState<ArtifactInfo[]>([]);
  const [seasonalArtifacts, setSeasonalArtifacts] = useState<ArtifactInfo[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactInfo | null>(null);

  useEffect(() => {
    LayoutFetcher.fetchLayouts().then((layoutsFetched) => {
      setLayouts(layoutsFetched);
    });
  }, []);

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

  const toggleListVisibility = async () => {
    let tempListVisible = listVisible;
    setListVisible(!listVisible);

    let compBuilderGrid = document?.getElementById('compBuilderGrid');
    if (compBuilderGrid) {
      if (tempListVisible) {
        compBuilderGrid.style.gridTemplateColumns = "1fr";
        return appWindow.isMaximized().then((maximized) => {
          if (!maximized) {
            return appWindow.setSize(new LogicalSize(500, 800));
          }
        });
      }
      else {
        compBuilderGrid.style.gridTemplateColumns = "1fr 2fr";
        return appWindow.isMaximized().then((maximized) => {
          if (!maximized) {
            return appWindow.setSize(new LogicalSize(1300, 800));
          }
        });

      }
    }
  }

  const addNewLoadout = () => {
    if (!selectedLayout) return;
    let newLoadoutName = prompt("New loadout name : ");
    if (!newLoadoutName) return;

    let newLoadout = Loadout.newFromUi(newLoadoutName);
    let newLoadouts = selectedLayout.loadouts;
    newLoadouts.push(newLoadout);
    selectedLayout.loadouts = newLoadouts;
    setSelectedLayout(selectedLayout);
    setSelectedLoadout(newLoadout);
    setSelectedLoadoutName(newLoadout.name);
    let newSelectedArtifact = newLoadout.artifact ? artifacts.find((artifact) => artifact.name === newLoadout.artifact) || null : null;
    setSelectedArtifact(newSelectedArtifact);
  }

  const modifyLoadoutUnit = (unit: Unit) => {
    if (!selectedLoadout) return;

    let newUnits = selectedLoadout.units.filter(u => u.positionX !== unit.positionX || u.positionY !== unit.positionY);
    newUnits.push(unit);
    selectedLoadout.units = newUnits;
    setSelectedLoadout(selectedLoadout);
  }

  return (
    <div id="compBuilder" style={{ height: "600px" }}>
      <h1>Composition builder</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", maxHeight: "600px" }} id="compBuilderGrid">
        <div id="layoutDiv">
          <span>
            <span>Layout Selection : </span>
            <select
              value={selectedLayoutName}
              onChange={onChangeLayoutSelection}
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
                <span className="layout-button" onClick={addNewLoadout}>Add +</span>
                <span className="layout-button" onClick={renameLoadout}>Rename ✏️</span>
                <span className="layout-button" onClick={() => {
                  if (!selectedLayout || !selectedLoadout) return;
                  LayoutFetcher.saveLayout(selectedLayout);
                  ArtifactInfoFetcher.saveArtifactInfo();
                  CharacterInfoFetcher.saveCharacterInfo();
                }}>Save 💾</span>
                <span className="layout-button" onClick={toggleListVisibility}>Toggle list</span>
              </div>
              <p></p>
              <MapDiv map={selectedLayout.map} loadout={selectedLoadout} modifyLoadout={modifyLoadoutUnit} />
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr" }}>
                <ArtifactImage imageId={`arti_${selectedArtifact?.id}`} title={selectedArtifact?.name} />
                <select
                  value={selectedArtifact?.name}
                  onChange={(e) => {
                    let findArtifact = artifacts.find((artifact) => artifact.name === e.target.value);
                    if (!findArtifact) {
                      findArtifact = seasonalArtifacts.find((artifact) => artifact.name === e.target.value);
                    }
                    setSelectedArtifact(findArtifact || null);
                    if (findArtifact && selectedLoadout) {
                      let temp = selectedLoadout;
                      temp.artifact = ArtifactType[findArtifact.name.toLowerCase() as keyof typeof ArtifactType];
                      modifyLoadout(temp);
                    }
                  }}
                  className="artifact-select"
                  style={{ maxHeight: "50%", alignSelf: "center", maxWidth: "200px" }}
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
                <span className="layout-button" style={{ width: "125px" }} onClick={async () => {
                  let folderPath = await getAppLocalDataDirPath();
                  invoke("open_explorer_folder", { fullPath: folderPath });
                }}>Open data folder</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ visibility: listVisible ? "visible" : "hidden", width: listVisible ? "100%" : "0%", height: listVisible ? "100%" : "0%" }}>
          <h2>Characters Selection</h2>
          <CharacterList />
        </div>
      </div>
    </div>
  );

  function onChangeLayoutSelection(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedLayoutName(e.target.value);
    let layout = layouts.find((layout) => layout.name === e.target.value) || null;
    setSelectedLayout(layout);
    if (!layout) return;

    if (!layout.loadouts || layout.loadouts.length === 0) { return; }

    setLayout(layout?.loadouts[0] || null);
    setSelectedLoadoutName(layout?.loadouts[0].name || "");
  }

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

memo(LayoutDiv);