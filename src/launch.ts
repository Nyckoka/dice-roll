
import express, { Router } from "express";

import database from "./database-mem";
import data_ext from "./data-ext";
import { Services } from "./interfaces";

import ServicesBuilder from "./services"
import ApiBuilder from "./api"
import SiteBuilder from "./site"

const app = express();

const PORT = 8080;

const services: Services = ServicesBuilder(database, data_ext);
const api: Router = ApiBuilder(services);
const site: Router = SiteBuilder(services);

app.set('view engine', 'hbs');

app.use("/api", api);
app.use("/", site)

app.listen(PORT);
