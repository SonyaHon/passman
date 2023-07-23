// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::{Error, State};

pub struct AppState {
    db_connection: Mutex<sqlite::Connection>,
}

pub enum FieldKind {
    Text,
    SecureText,
}

pub struct Field {
    id: String,
    kind: FieldKind,
    label: String,
    value: String,
    order: usize,
}

pub struct Entry {
    id: String,
    title: String,
    presented: Option<String>,
    fields: Vec<Field>,
}

#[tauri::command]
fn fetch_card(id: &str) {}

pub struct CreateEntryData {
    id: String,
    title: String,
}

#[tauri::command]
fn create_entry(app_state: &AppState, entry: &CreateEntryData) -> Result<(), Error> {
    app_state
        .db_connection
        .lock()
        .unwrap()
        .execute(format!(
            "INSERT INTO entries VALUES ({}, {})",
            entry.id, entry.title,
        ))
        .unwrap();
    Ok(())
}

pub fn setup_tables(connection: &sqlite::Connection) {
    connection
        .execute(
            "CREATE TABLE IF NOT EXISTS fields
(
    id         TEXT PRIMARY KEY,
    kind       TEXT    not null,
    label      TEXT    not null,
    value      TEXT,
    show_order INTEGER not null DEFAULT 0,
    entry_id   TEXT,
    FOREIGN KEY (entry_id) REFERENCES entries (id)
);

CREATE TABLE IF NOT EXISTS entries
(
    id        TEXT PRIMARY KEY,
    title     TEXT NOT NULL,
    presented TEXT,
    FOREIGN KEY (presented) REFERENCES fields (id)
);
",
        )
        .unwrap();
}

pub fn prepare_database() -> sqlite::Connection {
    let connection = sqlite::open("./db.sqlite").unwrap();
    setup_tables(&connection);
    connection
}

fn main() {
    let connection = prepare_database();

    tauri::Builder::default()
        .manage(AppState {
            db_connection: Mutex::new(connection),
        })
        .invoke_handler(tauri::generate_handler![fetch_card])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
