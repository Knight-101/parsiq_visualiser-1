const express = require("express");
const https = require("https");
const http = require("http");
const webSocketServer = require("websocket").server;
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(bodyParser.json());
const webSocketsServerPort = 8000;
var clientList = [];

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

app.post("/webhook", async function (req, res) {
  console.log(req.body);
  const toAdd = req.body.to;
  await axios
    .get(`${process.env.API_URL}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    })
    .then(async (res) => {
      console.log("---------------------");
      console.log(res.data);

      const addresses = res.data;
      for (let i = 0; i < addresses.length; i++) {
        if (toAdd !== addresses[i].address) {
          var data = JSON.stringify([
            {
              address: toAdd,
            },
          ]);

          var config = {
            method: "post",
            url: `${process.env.API_URL}`,
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
              "Content-Type": "application/json",
            },
            data: data,
          };
          await axios(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
              console.log("Added");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
  clientList.forEach((client) => {
    client.send(JSON.stringify(req.body));
  });
  res.send("OK");
});

const server = app.listen(
  process.env.PORT || webSocketsServerPort,
  function () {
    console.log("server listening on port 8000");
  }
);

const wsServer = new webSocketServer({
  httpServer: server,
});

wsServer.on("request", function (request) {
  var connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");
  clientList.push(connection);
  connection.sendUTF("hello");
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
