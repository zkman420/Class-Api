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
      value: "C27055CF%2DB252%2D5277%2DE714DD72901A3DFE",
    },
    {
      name: "SESSIONTOKEN",
      value: "C27055CE%2DFE2F%2DCB13%2D8A07FDA8AE5B85ED",
    },
    {
      name: "CFID",
      value: "5065946",
    },
    {
      name: "CFTOKEN",
      value: "95cd02481515a22e-C26FC4D9-E905-B53B-3A05A62C31CA15A4",
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
        message: `Hello! Your next class is ${classes[0].class} at ${classes[0].location}`,
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

// Endpoint to trigger the API call manually
app.post("/test/:period", async (req, res) => {
  try {
    let period = req.params;
    console.log(period);
    const classes = await fetchClassInfo(period.period);
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

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

cron.schedule("30 13 * * *", async () => {
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
