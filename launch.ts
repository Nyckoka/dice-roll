

import express, { Router } from "express";
const app = express();

const PORT = 8080;

import database from "./database-mem";
import data_ext from "./data-ext";
import { services } from "./interfaces";
const services: services = require("./services")(database, data_ext);
const api: Router = require("./api")(services);

app.use("/api", api);

app.listen(PORT);
