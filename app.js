const config = require("./config.json");

const express = require("express");
const expressWs = require("express-ws");
const cookieParser = require("cookie-parser");

const app = express();
const appWs = expressWs(app);

const controllers = require("./controller/");

const wsRoute = require("./ws/");

app.set("view engine", "ejs");
app.use(cookieParser());

app.use("/", wsRoute)
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use(express.static("static", {extensions: ["html"]}));

app.use(controllers);

app.listen(config.port);

console.log("Started Express webserver on " + config.port);

require("./discord/");
require("./switchchat/");
