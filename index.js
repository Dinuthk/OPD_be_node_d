// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");

// Import Routes
const authRoutes = require('./auth/routes/auth.routes');
const userRoutes = require('./features/users/routes/user.routes');
const patientRoutes = require('./features/patients/routes/patient.routes');
const drugRoutes = require('./features/drugs/routes/drug.routes');

require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const option = {
    socketTimeoutMS: 30000,
};

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, option).then(function () {
    //connected successfully
    console.log("Mongo DB connected!")
}, function (err) {
    //err handle
    console.log("Failed to connect with Mongo DB", mongoURI)
});
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(cors(corsOptions));
//app.use(cors({ credentials: true }));
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });
const corsOptions = {
    origin: ['https://the-toucan-app-react.vercel.app/', 'https://toucan.supersconto24.com/api/v1/auth/me', 'https://toucan.supersconto24.com'],
    credentials: true, 
    optionSuccessStatus: 200
  };
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (request, response, next) {
    response.setHeader('Cache-Control', 'no-cache, no-store');
    next();
});

// Middleware to handle OPTIONS requests for CORS
 
// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
});

app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/patient/', patientRoutes);
app.use('/api/v1/drug/', drugRoutes);

// set port, listen for requests
const APP_PORT = process.env.APP_PORT;
app.use(require('express-status-monitor')());
app.disable('x-powered-by');

app.listen(APP_PORT, () => {
    console.log(`Server is running on port ${APP_PORT}.`);
});

module.exports = app;
