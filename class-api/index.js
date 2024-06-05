const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");
const app = express();

const pushoverToken = "agc7po6u59qxzcf56qozp7bmjudhgi";
const userKey = "u6shfndeu1vn8tu1yc3w6vdtn93rxj";

const articles = [];

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3308",
  password: "",
  database: "Classes-Api",
  connectionLimit: 10
});

app.use(express.json()); // Add this line to parse JSON request bodies

app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

async function fetchClassInfo(period) {
  console.log("fetch " + period);
  const cookies = [
    {
      name: "SESSIONID",
      value: "FC458205%2DFEDD%2D30D7%2D90A276511A417B5F",
    },
    {
      name: "SESSIONTOKEN",
      value: "FC458204%2DAD51%2DDDF8%2D8E9C493201B6C437",
    },
    {
      name: "CFID",
      value: "5080134",
    },
    {
      name: "CFTOKEN",
      value: "4740c4c68913e9dc-FC4495A9-0326-4FD6-EF2AA063DCBC0CDB",
    },
  ];

  const cookieString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await axios.get(
      "https://tassweb.salc.qld.edu.au/studentcafe/index.cfm?do=studentportal.home#timetable",
      {
        headers: {
          Cookie: cookieString,
        },
      }
    );

    const html = response.data;
    const $ = cheerio.load(html);
    const classes = [];

    $("tr").each((index, element) => {
      const periodElement = $(element).find("td").eq(0).text().trim();
      const classInfoElement = $(element).find("td").eq(1).text().trim();
      const locationElement = $(element).find("td").eq(2).text().trim();
      const teacherElement = $(element).find("td").eq(3).text().trim();
      if (periodElement.includes(`${period}`)) {
        const classInfo = {
          period: periodElement,
          class: classInfoElement,
          location: locationElement,
          teacher: teacherElement,
        };
        console.log(classInfo); // Output the class information to the console
        classes.push(classInfo);
      }
    });

    // Send notification if classes are found
    if (classes.length > 0) {
      const message = {
        token: pushoverToken,
        user: userKey,
        message: `Hello! Your next class is ${classes[0].class} at ${classes[0].location} with ${classes[0].teacher}`,
      };

      await axios.post("https://api.pushover.net/1/messages.json", message);
    } else {
      console.log("No classes found.");
    }

    return classes;
  } catch (error) {
    console.error("Error fetching class info:", error);
    throw error;
  }
}

// Endpoint to post
app.post("/send/:period", async (req, res) => {
  try {
    let period = req.params;
    console.log(period);
    const classes = await fetchClassInfo(period.period);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/addUser', async (req, res) => {
  const { username, userKey } = req.body;

  if (!username || !userKey) {
    return res.status(400).json({ error: "Username, userKey are required." });
  }

  try {
    const sql = "INSERT INTO Users (username, userKey) VALUES (?, ?)";
    const values = [username, userKey];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting user: " + err);
        return res.status(500).json({ error: "An error occurred while adding the user." });
      }
      console.log("User added successfully.");
      res.status(200).json({ message: "User added successfully." });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "An error occurred while hashing the password" });
  }
});

app.post('/addcookies', async (req, res) => {
  const { UserID, CFID, CFTOKEN, SESSIONID, SESSIONTOKEN } = req.body;

  if (!UserID || !CFID || !CFTOKEN || !SESSIONID || !SESSIONTOKEN) {
    return res.status(400).json({ error: "UserID, CFID, CFTOKEN, SESSIONID, SESSIONTOKEN are required." });
  }

  try {
    const sql = "INSERT INTO `Cookies` (`UserID`, `CFID`, `CFTOKEN`, `SESSIONID`, `SESSIONTOKEN`) VALUES (?, ?, ?, ?, ?)";
    const values = [UserID, CFID, CFTOKEN, SESSIONID, SESSIONTOKEN];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting user: " + err);
        return res.status(500).json({ error: "An error occurred while adding the cookies." });
      }
      console.log("User added successfully.");
      res.status(200).json({ message: "cookies added successfully." });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "An error occurred " });
  }
});

// get 

app.get('/getCookies', async (req, res) => {
  const sql = "SELECT * FROM Cookies";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching cookies: " + err);
      return res.status(500).json({ error: "An error occurred while fetching the cookies." });
    }
    console.log("Cookies fetched successfully.");
    res.status(200).json(result);
  });
});
app.get('/getUsers', async (req, res) => {
  const sql = "SELECT * FROM Users";
  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users: " + err);
      return res.status(500).json({ error: "An error occurred while fetching the users." });
    }
    console.log("Users fetched successfully.");
    res.status(200).json(result);
  });
})



// Schedule the task to run at a specific time
cron.schedule("55 8 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 1";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

cron.schedule("45 9 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 2";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

cron.schedule("00 11 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 3";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});
cron.schedule("50 11 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 4";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

cron.schedule("25 13 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 5";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

cron.schedule("20 14 * * *", async () => {
  console.log("Schedule");
  try {
    let period = "Period 5";
    console.log("let" + period);
    const classes = await fetchClassInfo(period);
    console.log(classes);
    // Here you can do something with the `classes` array, such as saving to a database or sending an email
  } catch (error) {
    console.error("Scheduled task failed:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
