require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./utilities/db");
const Conversations = require("./models/conversations");
const User = require("./models/user");
const Pusher = require("pusher");
//const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./auth");
const passport = require("passport");
const bcrypt = require("bcrypt");
const ensureAuthenticated = require("./utilities/ensureAuthenticated");

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
app.use(passport.initialize());
app.use(passport.session());

// Set up our express app to use session
//app.use(
//  session({
//    secret: process.env.SESSION_SECRET,
//    resave: true,
//    saveUninitialized: true,
//    cookie: { secure: false },
//    key: "express.sid",
//    store: store,
//  })
//);

connectDB();

auth(passport);

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

app.post("/new/channel", (req, res) => {
  const body = req.body;

  // create new document with data
  Conversations.create(body, (err, data) => {
    err ? res.status(500).send(err) : res.status(201).send(data);
  });
});

app.get("/get/channelList", (req, res) => {
  Conversation.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

app.post("/new/message", (req, res) => {
  const id = req.query.id;
  const newMsg = req.body;
});

app.get("/get/data", (req, res) => {});

app.get("/get/conversation", (req, res) => {});

// AUTHENTICATION
// Authenticate on route /login
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    //    res.redirect("/chat");
    //    res.status(200).json(req.user.username);
    res.status(200).json(req.user);
  }
);
// If authentication middleware passes, redirect user to /profile
// If authentication was successful, the user object will be saved in req.user
app.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("pug/profile", { username: req.user.username });
});
// Renders chat.pug with user object
app.get("/chat", ensureAuthenticated, (req, res) => {
  res.render("pug/chat", { user: req.user });
});
// Unauthenticate user
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
// Allow a new user on our site to register an account
app.post(
  "/register",
  async (req, res, next) => {
    let uname = req.body.username;

    // Check if the user is already in the database and act accordingly
    let user = await User.findOne({ username: uname });
    if (user) {
      console.log(`user exists: ${user.username}`);
      res
        .status(200)
        .json({ message: `This username (${uname}) already exists.` });
    } else {
      // Implement saving a hash
      const hash = await bcrypt.hash(req.body.password, 12);

      user = new User({ username: uname, password: hash });

      user.save((err, doc) => {
        if (err) {
          console.error(`save error: ${err}`);
          res.redirect("/");
        }
        console.log(`Document inserted successfully, ${user.username}`);
        res.status(201).json(user);
        //        res.status(201).json({ username: user.username, _id: user._id });
        //        next(null, doc.ops[0]);
      });
    }
  }
  // JUST ROUTE TO CHAT IN FRONT END
  //  passport.authenticate("local", { failureRedirect: "/" }),
  //  (req, res, next) => {
  //    res.redirect("/chat");
  //  }
);
// Social authentication using Github strategy
app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user_id = req.user.id;
    res.redirect("/chat");
  }
);
// Handle missing pages (404)
app.use((req, res, next) => {
  res.status(404).type("text").send("Not Found");
});

// changed from 3000
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
