CREATE TABLE `Users` (
    `UserID` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `userKey` VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE `Cookies` (
    `CookieID` INT AUTO_INCREMENT PRIMARY KEY,
    `UserID` INT NOT NULL UNIQUE,
    `CFID` VARCHAR(255) NOT NULL UNIQUE,
    `CFTOKEN` VARCHAR(255) NOT NULL UNIQUE,
    `SESSIONID` VARCHAR(255) NOT NULL UNIQUE,
    `SESSIONTOKEN` VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
);

--@block
SELECT * FROM Cookies
--@block
SELECT * FROM Users
--@block
SHOW TABLES;
--@block
INSERT INTO `Users` (`username`, `userKey`) VALUES
('user1', 'key1'),
('user2', 'key2'),
('user3', 'key3');
INSERT INTO `Cookies` (`UserID`, `CFID`, `CFTOKEN`, `SESSIONID`, `SESSIONTOKEN`) VALUES
(1, 'cfid1', 'cftoken1', 'sessionid1', 'sessiontoken1'),
(2, 'cfid2', 'cftoken2', 'sessionid2', 'sessiontoken2'),
(3, 'cfid3', 'cftoken3', 'sessionid3', 'sessiontoken3');

