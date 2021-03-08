require('dotenv').config();
const { MongoClient } = require('mongodb');
//const mongoose = require('mongoose');

const main = async (callback) => {
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to the MongoDB cluster
//        await mongoose.connect(process.env.MONGO_URI, {
//            useNewUrlParser: true,
//            useUnifiedTopology: true
//        });
        await client.connect();

        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

module.exports = main;
