const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
const webhook = require("./webhook");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static("Public"));

//handled CORS
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/webhook", webhook);

app.listen(process.env.PORT || 3000, function () {
  console.log("server started");
});
