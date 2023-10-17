-- create users table
CREATE TABLE users (
    uid INT UNSIGNED,
    avatar_path VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender TINYINT,
    dob DATETIME,
    created_at DATETIME NOT NULL,
    games JSON
    type TINYINT DEFAULT 0,
    PRIMARY KEY (uid),
    UNIQUE (email)
);

-- create genres table
CREATE TABLE types (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- create companies table
CREATE TABLE companies (
    id INT AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);

-- create games table
CREATE TABLE games (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    types JSON,
    developers JSON NOT NULL,
    publisher INT NOT NULL,
    description TEXT,
    release_date DATETIME NOT NULL,
    size DECIMAL(5, 2) NOT NULL,
    cover_img_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    supported_platforms JSON NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (publisher) REFERENCES companies(id)
);

-- create store-related table
CREATE TABLE gameStoreRelatedIn4 (
    id INT NOT NULL,
    reviews JSON, -- {point: float, review: text}
    original_price DECIMAL(6, 2) NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES games(id)
);