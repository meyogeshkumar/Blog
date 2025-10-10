const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const connect = require("./Database/db");
const userSignlogrouter = require("./routes/userSignlogroutes");
const Blogroute = require("./routes/Blogroutes");

env.config();

const app = express();


app.use(cors());
app.use(express.json());


connect();


app.use("/api/user", userSignlogrouter);
app.use("/api/blog", Blogroute);


module.exports = app;
