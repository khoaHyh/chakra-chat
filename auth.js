require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const GitHubStrategy = require('passport-github').Strategy;

module.exports = (app, myDataBase) => {
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
    passport.use(new LocalStrategy(
        (username, password, done) => {
            myDataBase.findOne({ username: username }, (err, user) => {
                console.log('User '+ username +' attempted to log in.');
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
   
    // Github authentication strategy
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'https://advancednode-khoahyh.herokuapp.com/auth/github/callback' 
        }, (accessToken, refreshToken, profile, cb) => {
            console.log(profile);
            // Database logic here with callback containing our user object
            myDataBase.findOneAndUpdate(
                { id: profile.id },
                {
                    $setOnInsert: {
                        id: profile.id,
                        name: profile.displayName || 'John Doe',
                        photo: profile.photos[0].value || '',
                        email: Array.isArray(profile.emails)
                            ? profile.emails[0].value
                            : 'No public email',
                        created_on: new Date(),
                        provider: profile.provider || ''
                    },
                    $set: {
                        last_login: new Date()
                    },
                    $inc: {
                        login_count: 1
                    }
                },
                { upsert: true, new: true },
                (err, doc) => {
                    if (err) console.error(`findOneAndUpdate error: ${err}`);
                    return cb(null, doc.value);
                }
            );
        }
    ));
};
