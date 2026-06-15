const http=require('http');
const app=require("./src/config/express.config")
const httpServer=http.createServer(app)
// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger_output.json');

const PORT=9000;
const HOST='localhost';
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
httpServer.listen(9000,'localhost',()=>{
    console.log(`URL: http://${HOST}:${PORT}`)
    console.log("Server is running on port"+9000)
    console.log("Press CTRL+C to disconnect server")
})



