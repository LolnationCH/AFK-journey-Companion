#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn open_explorer_folder(full_path: &str) {
    let _ = std::process::Command::new("explorer")
        .arg(full_path)
        .output();
}

#[tauri::command]
fn get_layouts(folder_path: &str) -> Vec<String> {
    let layout_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts");
    let layouts = std::fs::read_dir(layout_path)
        .unwrap()
        .map(|entry| entry.unwrap().path())
        .filter(|path| path.is_file())
        .filter(|path| path.extension().unwrap_or_default() == "json")
        .map(|path| path.file_name().unwrap().to_str().unwrap().to_string())
        .collect::<Vec<String>>();

    // Send the layouts to the frontend
    return layouts;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_explorer_folder])
        .invoke_handler(tauri::generate_handler![get_layouts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
