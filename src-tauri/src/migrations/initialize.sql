CREATE TABLE IF NOT EXISTS entries
(
    id                 TEXT PRIMARY KEY,
    title              TEXT NOT NULL,
    avatar             TEXT,
    displayed_field_id TEXT,
    FOREIGN KEY (displayed_field_id) REFERENCES fields (id)
);

CREATE TABLE IF NOT EXISTS fields
(
    id         TEXT PRIMARY KEY,
    label      TEXT NOT NULL,
    variant    TEXT NOT NULL,
    show_order INT  NOT NULL,
    value      TEXT NOT NULL DEFAULT '',
    entry_id   TEXT NOT NULL,
    FOREIGN KEY (entry_id) REFERENCES entries (id)
);