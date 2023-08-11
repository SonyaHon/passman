pub mod models;

use diesel::{Connection, SqliteConnection};
use diesel::connection::{SimpleConnection};
use diesel::result::{DatabaseErrorKind, Error};

pub fn run_migrations(db_path: &str) {
    let migrations = vec![
        ("initialize", include_str!("../migrations/initialize.sql")),
    ];

    let mut connection = establish_connection(db_path);
    connection.batch_execute("CREATE TABLE IF NOT EXISTS migrations (migration TEXT PRIMARY KEY);").unwrap();

    for (name, migration) in migrations {
        connection.transaction(|c| {
            c.batch_execute(migration)?;
            c.batch_execute(format!("INSERT INTO migrations VALUES ('{}');", name).as_str())?;
            Ok::<(), Error>(())
        }).unwrap_or_else(|e: Error| {
            match e {
                Error::DatabaseError(kind, ..) => {
                    match kind {
                        DatabaseErrorKind::UniqueViolation => {}
                        _ => panic!("Error running migrations: {}", e),
                    };
                }
                _ => panic!("Error running migrations: {}", e),
            };
        });
    }
}

pub fn establish_connection(db_path: &str) -> SqliteConnection {
    SqliteConnection::establish(db_path)
        .unwrap_or_else(|_| panic!("Error opening {}", db_path))
}
