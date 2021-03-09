require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { 
            useCreateIndex: true,
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
    } catch (error) {
        console.error(`Initial database connection error: ${error}`);
    }
}

module.exports = connectDB;
