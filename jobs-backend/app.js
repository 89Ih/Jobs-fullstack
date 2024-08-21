require('dotenv').config();
var path = require('path');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index.routes');
const {PORT,ORIGIN} = process.env;
const cors = require("cors");
var app = express();

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly: true,
      secure: false, // set this to true on production
  }
}));
app.use(
  cors({
    origin: ORIGIN,
    methods:["POST","GET","DELETE","PUT"],
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log("Server is listing on " + `http://localhost:${PORT}`);
})

module.exports = app;
