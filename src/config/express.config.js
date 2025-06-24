const express=require("express")
const app=express()

app.use(express.json())
app.use("/api/atm_locator/", router);

// app.use(express.json())
// app.use(express.urlencoded())

app.use((req,res,next)=>{ 
    next({
        code:404,
        message:"Resources not found",
        status:"NOT_FOUND_ERR",
    })
    })

module.exports=app;