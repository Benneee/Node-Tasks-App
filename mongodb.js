const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const log = console.log;

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();

app.use(cors());

app.options("*", cors());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.listen(port, () => log(`Listening on port ${port}`));
