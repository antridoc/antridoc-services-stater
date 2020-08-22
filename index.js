const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require('./routes/router');

dotenv.config();

// connect to db
const UserRole = require('./model/Role');
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
    UserRole.syncRoles();
  }
);

// middlewares
app.use(express.json()); // for body parser

app.use(router);

app.listen(3000, () => console.log("server is running..."));
