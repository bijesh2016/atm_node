const http=require('http');
const app=require("./src/config/express.config")
const httpServer=http.createServer(app)

const PORT=9000;
const HOST='localhost';
httpServer.listen(9000,'localhost',()=>{
    console.log(`URL: http://${HOST}:${PORT}`)
    console.log("Server is running on port"+9000)
    console.log("Press CTRL+C to disconnect server")})



