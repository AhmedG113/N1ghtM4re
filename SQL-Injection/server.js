const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./db.sqlite");

// 1) middlewares لازم تيجي الأول
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 2) static serving
app.use(express.static("views"));

// 3) routes
app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  db.get(query, (err, row) => {
    if (row) {
      res.cookie("auth", "1");
      return res.redirect("/home");
    }
    return res.send("ACCESS DENIED");
  });
});

// 4) protected route
app.get("/home", (req, res) => {
  if (req.cookies && req.cookies.auth === "1") {
    return res.sendFile(path.join(__dirname, "views/home.html"));
  }
  return res.send("ACCESS DENIED");
});

// 5) listening
app.listen(1596, () => console.log("Running on 1596"));
