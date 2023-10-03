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

SELECT *
FROM usertrackers
WHERE JSON_UNQUOTE(JSON_EXTRACT(game_history, '$[*].gameID')) IN (
    SELECT id as gameID
    FROM games
    WHERE release_date >= DATE_SUB(CURDATE(), INTERVAL 100 DAY) + TIME('23:00:00') AND
            release_date < CURDATE() - TIME('23:00:00')
);
