#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn open_explorer_folder(full_path: &str) {
    let _ = std::process::Command::new("explorer")
        .arg(full_path)
        .output();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_explorer_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
