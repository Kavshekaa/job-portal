const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));

//MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: "5mb",
    extended: true
}));
app.use(cookieParser());
app.use(cors());

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
































const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
        const message = `Ressource not found ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate value
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }
    //Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "server error"
    })

}

module.exports = errorHandler;