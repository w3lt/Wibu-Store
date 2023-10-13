-- love
CREATE TABLE loves (
    uid INT UNSIGNED NOT NULL,
    gameID INT NOT NULL,
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (gameID) REFERENCES games(id),
    PRIMARY KEY (uid, gameID)
);

-- gift
CREATE TABLE gifts (
    id INT AUTO_INCREMENT,
    sender INT UNSIGNED NOT NULL,
    receiver INT UNSIGNED NOT NULL,
    gift JSON NOT NULL,
    message VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (sender) REFERENCES users(uid),
    FOREIGN KEY (receiver) REFERENCES users(uid)
);

DELIMITER //
CREATE TRIGGER check_sender_receiver
BEFORE INSERT ON gifts
FOR EACH ROW
BEGIN
    IF NEW.sender = NEW.receiver THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sender cannot be equal to Receiver';
    END IF;
END;
//
DELIMITER ;