-- games index
CREATE FULLTEXT INDEX seach_index
ON games(title, description);