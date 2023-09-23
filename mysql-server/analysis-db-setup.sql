CREATE TABLE usertrackers (
    uid INT UNSIGNED,
    game_history JSON NOT NULL,
    purchase_history JSON NOT NULL,
    favorite_games JSON NOT NULL,
    PRIMARY KEY (uid),
    FOREIGN KEY (uid) REFERENCES users(uid)
);