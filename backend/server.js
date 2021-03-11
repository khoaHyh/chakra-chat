require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const connectDB = require('./utilities/db');
const Pusher = require('pusher');

const pusher = new Pusher({
      appId: "1170571",
      key: `${process.env.PUSHER_KEY}`,
      secret: `${process.env.PUSHER_SECRET}`,
      cluster: "us2",
      useTLS: true
});

// Implement a Root-Level Request Logger Middleware
app.use((req, res, next) => {
    // console.log(req.method + " " + req.path + " - " + req.ip);
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Listen for error events on the database connection
mongoose.connection.on('error', err => {
    // Will not log if database disconnects, need to listen for disconnection for that
    logError(err);
});

// Execute a callback when the connection to mongodb is open
// because mongodb is not a real-time db we need to implement Pusher
// Firebase is an example of a real-time db
mongoose.connection.once('open', () => {
    console.log('Database Connected');

    // watches everything that happens with the database
    const changeStream = mongoose.connection.collection('conversations').watch();
    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('channels', 'newChannels', {
                'change': change
            });
        } else if (change.operationType === 'update') {
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            });
        } else {
            console.log('changeStream error');
        }
    });
});

app.get('/', (req, res) => res.status(200).send('get on route "/" works!');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
