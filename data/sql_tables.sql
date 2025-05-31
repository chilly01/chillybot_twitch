CREATE TABLE twitchpoints.players (
    name VARCHAR(255) NOT NULL PRIMARY KEY,
    points INT DEFAULT 1000,
    stream VARCHAR(255),
    start_time DATETIME,
    curr_time DATETIME
);

CREATE TABLE twitchpoints.tiltpoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player VARCHAR(255),
    points INT,
    date DATETIME,
    season INT,
    modifier VARCHAR(255),
    round INT,
    FOREIGN KEY (player) REFERENCES twitchpoints.players(name) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE twitchpoints.racepoints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player VARCHAR(255),
    points INT,
    date DATETIME,
    season INT,
    modifier VARCHAR(255),
    round INT,
    FOREIGN KEY (player) REFERENCES twitchpoints.players(name) ON DELETE CASCADE ON UPDATE CASCADE
);
