const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/reg")

    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((e) => {
        console.error("Connection error:", e.message);
    });