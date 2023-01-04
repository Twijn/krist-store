const config = require("./config.json");

const express = require("express");

const con = require("./database");

const app = express();

const controllers = require("./controller/");

app.set("view engine", "ejs");

app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use(express.static("static", {extensions: ["html"]}));

app.use(controllers);

app.listen(config.port);

console.log("Started Express webserver on " + config.port);