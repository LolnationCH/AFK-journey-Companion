import { open } from '@tauri-apps/api/shell';

export default function Footer() {
  return (
    <div id="footer">
      <hr />
      Creator <b>LolnationCH</b> : <span className="div-link" onClick={() => open("https://github.com/LolnationCH/AFK-journey-Companion")}>Source Code</span>
    </div>
  );
};