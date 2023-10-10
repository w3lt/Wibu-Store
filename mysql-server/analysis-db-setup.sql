CREATE TABLE usertrackers (
    uid INT UNSIGNED,
    game_history JSON NOT NULL, -- {"gameID": int, "timeVisit": int}
    purchase_history JSON NOT NULL,
    favorite_games JSON NOT NULL,
    PRIMARY KEY (uid),
    FOREIGN KEY (uid) REFERENCES users(uid)
);

CREATE TABLE topsellers_month (
    month VARCHAR(255),
    id INT,
    sell_number INT NOT NULL,
    PRIMARY KEY (month),
    FOREIGN KEY (id) REFERENCES games(id)
);

CREATE TABLE topsellers_quarter (
    quarter VARCHAR(255),
    id INT,
    sell_number INT NOT NULL,
    PRIMARY KEY (quarter),
    FOREIGN KEY (id) REFERENCES games(id)
);

CREATE TABLE topsellers_year (
    year VARCHAR(255),
    id INT,
    sell_number INT NOT NULL,
    PRIMARY KEY (year),
    FOREIGN KEY (id) REFERENCES games(id)
);

CREATE TABLE gametrackers (
    id INT,
    last30daysview INT NOT NULL,
    last30dayslovenumber INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES games(id)
);