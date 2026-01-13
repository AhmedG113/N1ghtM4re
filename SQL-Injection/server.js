const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("./db.sqlite");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  console.log("[DEBUG] SQL =>", query);

  db.get(query, (err, row) => {
    if (row) {
      return res.redirect("/home");
    }
    return res.send("ACCESS DENIED");
  });
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/debug-db", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    res.json(rows);
  });
});

app.listen(1596, () => console.log("Challenge running on port 1596"));
