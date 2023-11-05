USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    picture VARCHAR(255) DEFAULT 'default.png',
    rating INT(12) DEFAULT '0',
    isActivated BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner VARCHAR(100) NOT NULL,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(5000) NOT NULL,
    date DATETIME NOT NULL,
    status boolean NOT NULL DEFAULT true,
    edited boolean NOT NULL DEFAULT false,
    rating INT(12) DEFAULT '0',
    categories JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner VARCHAR(100) NOT NULL,
    owner_id INT NOT NULL,
    post_id INT NOT NULL,
    content VARCHAR(3000) NOT NULL,
    date DATETIME,
    rating INT(12) DEFAULT '0',
    status boolean NOT NULL DEFAULT true,
    edited boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(100) NOT NULL,
    post_id INT NOT NULL DEFAULT '0',
    comment_id INT NOT NULL DEFAULT '0',
    dislike boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    token VARCHAR(512) NOT NULL
);