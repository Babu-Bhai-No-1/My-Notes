const mongoose = require('mongoose');
require('dotenv').config(); // load variables from .env

const mongoURI = process.env.MONGO_URI; // use cloud MongoDB URI

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas Successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

module.exports = connectToMongo;
