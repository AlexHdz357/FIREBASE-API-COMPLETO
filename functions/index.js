const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

const app = express();

app.get("/hello-world", (req, res) => {
  return res.status(200).json({message: "Hello World!"});
});

app.use(require("./reportes.routes"));

exports.app = functions.https.onRequest(app);

