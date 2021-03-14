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
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
const GitHubStrategy = require("passport-github").Strategy;
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

connectDB();

/* PASSPORT START */
// Convert object contents into a key
passport.serializeUser((user, done) => {
  done(null, user._id);
});
// Convert key into original object
passport.deserializeUser((id, done) => {
  myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    if (err) return console.error(`myDataBase.findOne error: ${err}`);
    done(null, doc);
  });
});
// Define process to use when we try to authenticate someone locally
passport.use(
  new LocalStrategy((username, password, done) => {
    myDataBase.findOne({ username: username }, (err, user) => {
      console.log("User " + username + " attempted to log in.");
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

// Github authentication strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        "https://discord-clone-khoahyh.herokuapp.com/auth/github/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      // Database logic here with callback containing our user object
      myDataBase.findOneAndUpdate(
        { id: profile.id },
        {
          $setOnInsert: {
            id: profile.id,
            name: profile.displayName || "John Doe",
            photo: profile.photos[0].value || "",
            email: Array.isArray(profile.emails)
              ? profile.emails[0].value
              : "No public email",
            created_on: new Date(),
            provider: profile.provider || "",
          },
          $set: {
            last_login: new Date(),
          },
          $inc: {
            login_count: 1,
          },
        },
        { upsert: true, new: true },
        (err, doc) => {
          if (err) console.error(`findOneAndUpdate error: ${err}`);
          return cb(null, doc.value);
        }
      );
    }
  )
);
/* PASSPORT END */

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
//app.post("/login", (req, res) => {
//  console.log("login works");
//  let results = users.find((user) => user.username === req.body.username);
//  if (results) {
//    if (results.password == req.body.password) {
//      res.status(200).json({ message: "successful login" });
//    } else {
//      res.status(200).json({ message: "wrong password" });
//    }
//  } else {
//    res.status(200).json({ message: "user not found" });
//  }
//});
//
//app.post("/register", (req, res) => {
//  console.log("register works");
//  let results = users.find((user) => user.username === req.body.username);
//  results
//    ? res.status(200).json({ message: "user already in database" })
//    : console.log("register success!");
//});

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

// AUTHENTICATION
app.get("/", (req, res) => {
  //Change the response to render the Pug template
  res.render("pug", {
    title: "Connected to Database",
    message: "Please login",
    showLogin: true,
    showRegistration: true,
    showSocialAuth: true,
  });
});
// Authenticate on route /login
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/chat");
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
  (req, res, next) => {
    // Implement saving a hash
    const hash = bcrypt.hashSync(req.body.password, 12);
    // Check if user exists already
    myDataBase.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect("/");
      } else {
        myDataBase.insertOne(
          {
            username: req.body.username,
            password: hash,
          },
          (err, doc) => {
            if (err) {
              res.redirect("/");
            } else {
              // The inserted document is held within
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        );
      }
    });
  },
  passport.authenticate("local", { failureRedirect: "/" }),
  (req, res, next) => {
    res.redirect("/chat");
  }
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
