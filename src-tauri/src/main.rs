#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use diesel::insert_into;
use diesel::prelude::*;
use diesel::result::Error;
use serde::{Deserialize, Serialize};
use tauri::State;
use crate::database::establish_connection;
use crate::database::models::{DBEntry, DBField};
use crate::database::models::fields::entry_id;

mod database;

pub struct AppState {
    db_path: String,
}

impl AppState {
    fn new(db_path: &str) -> Self {
        Self { db_path: db_path.to_string() }
    }

    fn get_connection(&self) -> SqliteConnection {
        establish_connection(self.db_path.as_str())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppEntry {
    id: String,
    title: String,
    avatar: Option<String>,
    #[serde(rename(deserialize = "displayedField", serialize = "displayedField"))]
    displayed_field: Option<AppField>,
    fields: Vec<AppField>,
}

impl AppEntry {
    fn new(db_entry: &DBEntry, fields: Vec<AppField>) -> Self {
        let displayed_field = if let Some(displayed_field_id) = db_entry.displayed_field_id.clone() {
            Some(fields.iter().find(|f| {
                f.id == displayed_field_id
            }).unwrap().clone())
        } else {
            None
        };

        Self {
            id: db_entry.id.clone(),
            title: db_entry.title.clone(),
            avatar: db_entry.avatar.clone(),
            displayed_field,
            fields,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppField {
    id: String,
    label: String,
    variant: String,
    order: i32,
    value: String,
}

impl AppField {
    fn new(db_field: &DBField) -> Self {
        Self {
            id: db_field.id.clone(),
            label: db_field.label.clone(),
            variant: db_field.variant.clone(),
            order: db_field.show_order,
            value: db_field.value.clone(),
        }
    }
}

#[tauri::command]
fn create_new_entry(app_state: State<AppState>, entry: AppEntry) {
    let mut connection = app_state.get_connection();

    println!("Entry: {:?}", entry);

    connection.transaction(|c| {
        insert_into(database::models::entries::table).values((
            database::models::entries::id.eq(entry.id.clone()),
            database::models::entries::title.eq(entry.title),
            database::models::entries::avatar.eq(entry.avatar),
            database::models::entries::displayed_field_id.eq(entry.displayed_field.map(|f| f.id)),
        )).execute(c)?;

        for field in entry.fields {
            insert_into(database::models::fields::table).values(
                (
                    database::models::fields::id.eq(field.id.clone()),
                    database::models::fields::label.eq(field.label.clone()),
                    database::models::fields::variant.eq(field.variant.clone()),
                    database::models::fields::show_order.eq(field.order),
                    database::models::fields::value.eq(field.value.clone()),
                    database::models::fields::entry_id.eq(entry.id.clone()),
                )
            ).execute(c)?;
        }

        Ok(())
    }).unwrap_or_else(|e: Error| panic!("Error while writing to the database: {}", e));
}

#[tauri::command]
fn fetch_all(app_state: State<AppState>) -> Vec<AppEntry> {
    let mut connection = app_state.get_connection();
    let db_entries = database::models::entries::table.select(
        DBEntry::as_select()
    ).get_results(&mut connection).unwrap();

    db_entries.iter().map(|db_entry| {
        let fields: Vec<AppField> = DBField::belonging_to(db_entry).select(DBField::as_select())
            .get_results(&mut connection).unwrap()
            .iter()
            .map(|db_field: &DBField| {
                AppField::new(db_field)
            }).collect();

        AppEntry::new(db_entry, fields)
    }).collect()
}

fn main() {
    let db_path = "./db.sqlite";
    database::run_migrations(db_path);

    tauri::Builder::default()
        .manage(AppState::new(db_path))
        .invoke_handler(tauri::generate_handler![fetch_all, create_new_entry])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

//
// use diesel::prelude::*;
// use diesel::sqlite::SqliteConnection;
//
// use serde::{Deserialize, Serialize};
// use tauri::{State};
//
// pub fn establish_connection(db_path: &str) -> SqliteConnection {
//     SqliteConnection::establish(db_path)
//         .unwrap_or_else(|_| panic!("Error opening {}", db_path))
// }
//
// table! {
//     entries (id) {
//         id -> Text,
//         title -> Text,
//         avatar -> Nullable<Text>,
//         displayed_field_id -> Nullable<Text>,
//     }
// }
//
// table! {
//     fields (id) {
//         id -> Text,
//         label -> Text,
//         variant -> Text,
//         order -> Integer,
//         value -> Text,
//         entry_id -> Text,
//     }
// }
//
// joinable!(fields -> entries (entry_id));
// allow_tables_to_appear_in_same_query!(entries, fields);
//
// #[derive(Debug, Deserialize, Serialize, PartialEq)]
// pub enum FieldVariant {
//     #[serde(rename(deserialize = "Plain Text", serialize = "Plain Text"))]
//     PlainText,
//     #[serde(rename(deserialize = "Password", serialize = "Password"))]
//     Password,
//     #[serde(rename(deserialize = "Secure Text", serialize = "Secure Text"))]
//     SecureText,
// }
//
// #[derive(Debug, Deserialize, Serialize, Queryable, Selectable, Identifiable, PartialEq)]
// #[diesel(table_name = entries)]
// pub struct DBEntry {
//     id: String,
//     title: String,
//     avatar: Option<String>,
//     #[serde(rename(deserialize = "displayedField"))]
//     displayed_field_id: Option<String>,
// }
//
// #[derive(Debug, Deserialize, Serialize, Queryable, Selectable, Identifiable, PartialEq, Associations)]
// #[diesel(belongs_to(DBEntry, foreign_key = entry_id))]
// #[diesel(table_name = fields)]
// pub struct DBField {
//     id: String,
//     label: String,
//     variant: FieldVariant,
//     order: usize,
//     value: String,
//     entry_id: String,
// }
//
// pub struct AppState {
//     db_path: String,
// }
//
// impl AppState {
//     pub fn new(db_path: String) -> Self {
//         Self {
//             db_path
//         }
//     }
// }
//
// #[tauri::command]
// fn fetch_all(app_state: State<AppState>) -> Vec<DBEntry> {
//     let mut connection = establish_connection(app_state.db_path.clone().as_str());
//     let entries_docs = entries::table.select(DBEntry::as_select())
//         .get_results(&mut connection).unwrap_or_else(|e| panic!("Error during a request, {}", e));
//
//     println!("{:?}", entries_docs);
//
//     // entries_docs.iter_mut().for_each(|entry| {
//     //     entry.fields = DBField::belonging_to(&entry).select(DBField::as_select()).load(&mut connection)?;
//     // });
//     entries_docs
// }
//
// fn main() {
//     tauri::Builder::default()
//         .manage(AppState::new("./db.sqlite".to_string()))
//         .invoke_handler(tauri::generate_handler![fetch_all])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }
//
// //
// // use std::fmt::{Display, format, Formatter};
// // use serde::Deserialize;
// // use std::sync::Mutex;
// // use tauri::{Error, State};
// //
// // pub struct AppState {
// //     db_connection: Mutex<sqlite::Connection>,
// // }
// //
// // #[derive(Debug, Deserialize)]
// // pub enum FieldVariant {
// //     #[serde(rename(deserialize = "Plain Text"))]
// //     PlainText,
// //     #[serde(rename(deserialize = "Password"))]
// //     Password,
// //     #[serde(rename(deserialize = "Secure Text"))]
// //     SecureText,
// // }
// //
// // impl Display for FieldVariant {
// //     fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
// //         match self {
// //             FieldVariant::Password => write!(f, "password"),
// //             FieldVariant::SecureText => write!(f, "secure-text"),
// //             FieldVariant::PlainText => write!(f, "plain-text")
// //         }
// //     }
// // }
// //
// // #[derive(Debug, Deserialize)]
// // pub struct FieldEntryData {
// //     id: String,
// //     label: String,
// //     variant: FieldVariant,
// //     order: usize,
// //     value: String,
// // }
// //
// // #[derive(Debug, Deserialize)]
// // pub struct CreateEntryData {
// //     id: String,
// //     title: String,
// //     avatar: Option<String>,
// //     #[serde(rename(deserialize = "displayedField"))]
// //     displayed_field: Option<String>,
// //     fields: Vec<FieldEntryData>,
// // }
// //
// // #[tauri::command]
// // fn create_entry(entry: CreateEntryData, app_state: State<AppState>) -> Result<(), Error> {
// //     app_state
// //         .db_connection
// //         .lock()
// //         .unwrap()
// //         .execute(format!(
// //             "INSERT INTO entries VALUES ('{}', '{}', {})",
// //             entry.id,
// //             entry.title,
// //             if let Some(df) = entry.displayed_field { format!("'{}'", df) } else { "NULL".to_string() },
// //         ))
// //         .unwrap();
// //
// //     for field in entry.fields {
// //         app_state
// //             .db_connection
// //             .lock()
// //             .unwrap()
// //             .execute(
// //                 format!("INSERT INTO fields VALUES ('{}', '{}', '{}', '{}', {}, '{}')",
// //                         field.id,
// //                         field.variant,
// //                         field.label,
// //                         field.value,
// //                         field.order,
// //                         entry.id
// //                 ))
// //             .unwrap()
// //     }
// //
// //     Ok(())
// // }
// //
// // #[tauri::command]
// // pub fn fetch_all(app_state: State<AppState>) -> Vec<CreateEntryData> {
// //     let mut entries = vec![];
// //     app_state.db_connection.lock().unwrap()
// //         .iterate("SELECT * FROM entries", |pairs| {
// //             let mut id: String;
// //             let mut title: String;
// //             let mut presented: Option<String>;
// //
// //             for &(name, value) in pairs.iter() {
// //
// //             }
// //
// //             entries.push(CreateEntryData::);
// //
// //             true
// //         }).unwrap();
// // }
// //
// // pub fn setup_tables(connection: &sqlite::Connection) {
// //     connection
// //         .execute(
// //             "CREATE TABLE IF NOT EXISTS fields
// // (
// //     id         TEXT PRIMARY KEY,
// //     kind       TEXT    not null,
// //     label      TEXT    not null,
// //     value      TEXT,
// //     show_order      INTEGER not null DEFAULT 0,
// //     entry_id   TEXT,
// //     FOREIGN KEY (entry_id) REFERENCES entries (id)
// // );
// //
// // CREATE TABLE IF NOT EXISTS entries
// // (
// //     id        TEXT PRIMARY KEY,
// //     title     TEXT NOT NULL,
// //     presented TEXT,
// //     FOREIGN KEY (presented) REFERENCES fields (id)
// // );
// // ",
// //         )
// //         .unwrap();
// // }
// //
// // pub fn prepare_database() -> sqlite::Connection {
// //     let connection = sqlite::open("./db.sqlite").unwrap();
// //     setup_tables(&connection);
// //     connection
// // }
// //
// // fn main() {
// //     let connection = prepare_database();
// //
// //     tauri::Builder::default()
// //         .manage(AppState {
// //             db_connection: Mutex::new(connection),
// //         })
// //         .invoke_handler(tauri::generate_handler![create_entry, fetch_all])
// //         .run(tauri::generate_context!())
// //         .expect("error while running tauri application");
// // }
