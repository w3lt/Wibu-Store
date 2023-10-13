CREATE TABLE purchaseHistories (
    id INT NOT NULL AUTO_INCREMENT,
    uid INT UNSIGNED NOT NULL,
    gameID INT NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    time DATETIME NOT NULL,
    card_information JSON NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (gameID) REFERENCES games(id)
);