const express = require("express");
const multer = require("multer");
const cors = require("cors");
const router = require("./router.config");
const { swaggerUi, swaggerSpec } = require('./swagger');
require("./mongo.config")
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // React development server
    'http://localhost:5173', // Vite development server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/atm_locator/", router);
app.get('/test',(req,res)=>{
       console.log('testin')
       res.json({ message: 'CORS is working!', timestamp: new Date().toISOString() });
})

app.use("/assets", express.static("./public/uploads"));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req, res, next) => {
  next({
    code: 404,
    message: "Resources not found",
    status: "NOT_FOUND_ERR",
  });
});

app.use((error, req, res, next) => {


  console.log("garbage Collector:", error);
  console.log("I am here");


  let statusCode = error.code || 500;
  let details = error.details || null;
  let msg = error.message || "Internal Server Error";
  let status = error.status || "SERVER ERROR";

  if(error.name==="MongoServerError"){
        statusCode=400;
        msg='DB error'
        status='DB_ERROR'
        details={};

        if(+error.code===11000){
            Object.keys(error.keyPattern).map((field)=>{
                details[field]=`${field} should be unique.`
            })
        }
    }

  res.status(statusCode).json({
    error: details,
    message: msg,
    status: status,
    option: null,
  });
});

module.exports = app;
