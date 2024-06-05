CREATE TABLE `Users` (
    `UserID` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `userKey` VARCHAR(255) NOT NULL
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
DROP TABLE Cookies, Users;
--@block // kian
INSERT INTO `Users` (`username`, `userKey`) VALUES
('Kian', 'u6shfndeu1vn8tu1yc3w6vdtn93rxj');

INSERT INTO `Cookies` (`UserID`, `CFID`, `CFTOKEN`, `SESSIONID`, `SESSIONTOKEN`) VALUES
(1, '5065946', '95cd02481515a22e-C26FC4D9-E905-B53B-3A05A62C31CA15A4', 'C27055CF%2DB252%2D5277%2DE714DD72901A3DFE', 'C27055CE%2DFE2F%2DCB13%2D8A07FDA8AE5B85ED');
--@block // jack
INSERT INTO `Users` (`username`, `userKey`) VALUES
('Jack', 'u6shfndeu1vn8tu1yc3w6vdtn93rxj');

INSERT INTO `Cookies` (`UserID`, `CFID`, `CFTOKEN`, `SESSIONID`, `SESSIONTOKEN`) VALUES
(2, '5080134', '4740c4c68913e9dc-FC4495A9-0326-4FD6-EF2AA063DCBC0CDB', 'FC458205%2DFEDD%2D30D7%2D90A276511A417B5F', 'FC458204%2DAD51%2DDDF8%2D8E9C493201B6C437');