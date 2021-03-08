const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = (app, myDataBase) => {
    // Be sure to change the title
    app.route('/').get((req, res) => {
    //Change the response to render the Pug template
        res.render('pug', {
            title: 'Connected to Database',
            message: 'Please login',
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });
    // Authenticate on route /login
    app.route('/login').post(passport.authenticate('local', 
        { failureRedirect: '/' }), (req, res) => {
            res.redirect('/chat');
    });
    // If authentication middleware passes, redirect user to /profile
    // If authentication was successful, the user object will be saved in req.user
    app.route('/profile').get(ensureAuthenticated, (req, res) => {
        res.render('pug/profile', { username: req.user.username });
    });
    // Renders chat.pug with user object
    app.route('/chat').get(ensureAuthenticated, (req, res) => {
        res.render('pug/chat', { user: req.user });
    });
    // Unauthenticate user
    app.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    });
    // Allow a new user on our site to register an account
    app.route('/register').post(
        (req, res, next) => {
            // Implement saving a hash
            const hash = bcrypt.hashSync(req.body.password, 12);
            // Check if user exists already
            myDataBase.findOne({ username: req.body.username }, (err, user) => {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    }, (err, doc) => {
                        if (err) {
                            res.redirect('/');
                        } else {
                            // The inserted document is held within
                            // the ops property of the doc
                            next(null, doc.ops[0]);
                        }
                    });
                }
            });
        },
        passport.authenticate('local', { failureRedirect: '/' }), (req, res, next) => {
            res.redirect('/chat');
        }
    );
    // Social authentication using Github strategy
    app.route('/auth/github').get(passport.authenticate('github'));
    app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), 
        (req, res) => {
            req.session.user_id = req.user.id
            res.redirect('/chat');
    });
    // Handle missing pages (404)
    app.use((req, res, next) => {
        res.status(404).type('text').send('Not Found');
    });
};

// Middleware to check if a user is authenticated
// Prevents users going to /profile whether they authenticated or not
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
};
