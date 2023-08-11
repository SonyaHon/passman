use diesel::table;
use diesel::prelude::*;

table! {
    entries (id) {
        id -> Text,
        title -> Text,
        avatar -> Nullable<Text>,
        displayed_field_id -> Nullable<Text>,
    }
}

table! {
    fields (id) {
        id -> Text,
        label -> Text,
        variant -> Text,
        show_order -> Integer,
        value -> Text,
        entry_id -> Text,
    }
}

joinable!(fields -> entries (entry_id));
allow_tables_to_appear_in_same_query!(entries, fields);

#[derive(Queryable, Identifiable, Insertable, Selectable, Debug, PartialEq)]
#[diesel(table_name = entries)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct DBEntry {
    pub id: String,
    pub title: String,
    pub avatar: Option<String>,
    pub displayed_field_id: Option<String>,
}

#[derive(Queryable, Selectable, Insertable, Identifiable, Associations, Debug, PartialEq)]
#[diesel(table_name = fields)]
#[diesel(belongs_to(DBEntry, foreign_key = entry_id))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct DBField {
    pub id: String,
    pub label: String,
    pub variant: String,
    pub show_order: i32,
    pub value: String,
    pub entry_id: String,
}