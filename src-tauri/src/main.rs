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
    let _ = std::fs::create_dir(layout_path.clone());
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

#[tauri::command]
fn delete_layouts(folder_path: &str) {
    let layout_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts");
    let _ = std::fs::remove_dir_all(layout_path);
}

use std::path::Path;
use std::{fs, io};

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

#[tauri::command]
fn backup_layouts(folder_path: &str) {
    let layout_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts");
    let backup_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts_backup");
    copy_dir_all(layout_path, backup_path).unwrap();
}

#[tauri::command]
fn apply_backup_layouts(folder_path: &str) {
    let layout_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts");
    let backup_path = std::path::Path::join(std::path::Path::new(folder_path), "layouts_backup");
    copy_dir_all(backup_path, layout_path).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_explorer_folder,
            get_layouts,
            delete_layouts,
            backup_layouts,
            apply_backup_layouts
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
