const express = require("express");
const env = require("dotenv")
env.config()
const cors = require("cors")
const app = express();
const connect = require("./Database/db");
const User = require("./schema/userSignupDetails");
const userSignlogrouter = require("./routes/userSignlogroutes");
const Blogroute = require("./routes/Blogroutes");


app.use(cors())
app.use(express.json());

connect();

app.use(userSignlogrouter)

app.use(Blogroute)

app.listen(process.env.PORT_NO, () => {
  console.log("server is start");
})