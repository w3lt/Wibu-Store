-- games index
CREATE FULLTEXT INDEX seach_index
ON games(title, description);

-- users index
CREATE INDEX seach_index
ON users(email, username);