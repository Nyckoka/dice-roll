

const express = require("express");
const app = express();

const PORT = 8080;

const database = require("./database-mem");
const data_ext = require("./data-ext");
const services = require("./services")(database, data_ext);
const api = require("./api")(services);

app.use("/api", api);

app.listen(PORT);
