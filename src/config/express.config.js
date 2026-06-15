const express = require("express");
const multer = require("multer");
const cors = require("cors");
const router = require("./router.config");
const { swaggerUi, swaggerSpec } = require('./swagger');
require("./mongo.config");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { globalErrorHandler, notFoundHandler } = require("../utilities/errorHandler");
const path = require("path");
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'http://127.0.0.1:3000',
    'https://da1d3ce00fcf.ngrok-free.app/ '
     ],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'hgfx12354fdfrgsd',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, 
}));


app.use("/api/atm_locator/", router);

app.use("/assets", express.static("./public/uploads"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 404 handler for unhandled routes
app.use(notFoundHandler);

// app.get('/api/maps-key', (req, res) => {
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//   if (!apiKey) {
//     return res.status(500).json({ error: 'API key not found' });
//   }
//   res.json({ apiKey });
// });

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
