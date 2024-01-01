const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();

const express = require("express");
const app = express();
const musicRouter = require("./router/router");

const port = process.env.PORT;
app.use(express.json());
app.use("/", musicRouter);

app.listen(port, () => {
  console.log("Server is the running port on " + port);
});
