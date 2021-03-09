require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const connectDB = require('./db');

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

app.get('/', (req, res) => res.status(200).send('get on route "/" works!');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
