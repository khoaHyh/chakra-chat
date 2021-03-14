require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
// const ObjectID = require('mongodb').ObjectID;
const GitHubStrategy = require("passport-github").Strategy;
const User = require("./models/user");

module.exports = (passport) => {
  // Convert object contents into a key
  // determines which data of the user object should be stored in the session
  passport.serializeUser((user, done) => done(null, user._id));
  // Convert key into original object and retrieve object contents
  passport.deserializeUser((id, done) => {
    User.findOne(user._id, (err, doc) => {
      if (err) return console.error(`myDataBase.findOne error: ${err}`);
      done(null, doc);
    });
  });
  // Define process to use when we try to authenticate someone locally
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      let user = await User.findOne({ username: username });
      console.log("User " + username + " attempted to log in.");
      if (!user) {
        return done(null, false, { message: "User not found." });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        done(err);
      }
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
        Users.findOne({ _id: profile.id }, (err, user) => {
          if (user) {
            console.log(`user exists: ${user.username}`);
            return done(err, user);
          } else {
            user = new User({
              username: profile.username,
              provider: "github",
            });

            user.save((err, doc) => {
              if (err) console.error(`save error: ${err}`);
              return done(err, doc);
            });
          }
        });
      }
    )
  );
};
