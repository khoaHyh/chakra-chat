require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./utilities/db");
const conversations = require("./models/conversations");
const Pusher = require("pusher");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const pusher = new Pusher({
  appId: "1170571",
  key: `${process.env.PUSHER_KEY}`,
  secret: `${process.env.PUSHER_SECRET}`,
  cluster: "us2",
  useTLS: true,
});

const users = [{ username: "john doe", password: "abc123" }];

// Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
  // console.log(req.method + " " + req.path + " - " + req.ip);
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Listen for error events on the database connection
mongoose.connection.on("error", (err) => {
  // Will not log if database disconnects, need to listen for disconnection for that
  logError(err);
});

// Execute a callback when the connection to mongodb is open
// because mongodb is not a real-time db we need to implement Pusher
// Firebase is an example of a real-time db
mongoose.connection.once("open", () => {
  console.log("Database Connected");

  // watches everything that happens with the database
  const changeStream = mongoose.connection.collection("conversations").watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      pusher.trigger("channels", "newChannels", {
        change: change,
      });
    } else if (change.operationType === "update") {
      pusher.trigger("conversation", "newMessage", {
        change: change,
      });
    } else {
      console.log("changeStream error");
    }
  });
});

app.get("/", (req, res) => {
  // get list of all users
  res.status(200).json("woot");
});

// test post
app.post("/login", (req, res) => {
  console.log("login works");
  let results = users.find((user) => user.username == req.body.username);
  if (results) {
    if (results.password == req.body.password) {
      res.status(200).json({ message: "successful login" });
    } else {
      res.status(200).json({ message: "wrong password" });
    }
  } else {
    res.status(200).json({ message: "user not found" });
  }
});

app.post("/new/channel", (req, res) => {
  const body = req.body;

  // create new document with data
  conversations.create(body, (err, data) => {
    err ? res.status(500).send(err) : res.status(201).send(data);
  });
});

app.get("/get/channelList", (req, res) => {
  conversation.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

app.post("/new/message", (req, res) => {
  const id = req.query.id;
  const newMsg = req.body;
});

app.get("/get/data", (req, res) => {});

app.get("/get/conversation", (req, res) => {});

// changed from 3000
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
