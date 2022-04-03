// Imports
const express = require("express");
const bodyParser = require("body-parser");
const apiRouter = require("./apiRouter").router;
const cors = require("cors");

// Instantiate server
const server = express();

// Add cors
server.use(cors());

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// static files (upload)
server.use("/uploads", express.static("uploads"));

// Configure routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("<h1>Bonjour sur mon super server</h1>");
});

server.use("/api/", apiRouter);

// Launch server
server.listen(8080, function () {
  console.log("Server en écoute :)");
});
