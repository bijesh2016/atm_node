const mongoose=require("mongoose");
const { mongoConfig } = require("./config");

(async()=>{
    try{
        await mongoose.connect(mongoConfig.url,{
            dbName: mongoConfig.dbName,
            autoCreate:true,
            autoIndex:true
        })
        console.log("****Mongodb Connection Connected****")
    }catch(exception){
        console.log("****Mongodb Connection Error****")
        console.log(exception)
    }
})()