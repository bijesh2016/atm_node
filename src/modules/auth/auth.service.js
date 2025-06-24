const SessionModel = require("./session.model")


class AuthService{
async storeSession(data){
    try{
        const session=new SessionModel(data)
        return await session.save()
    }catch(exception){
    throw exception
}
}

async getSingleRowByFilter(filter){
    try{
        const sessionData=await SessionModel.findOne(filter);
        return sessionData;
    }catch(exception){
        throw exception
    }
}

async destroySession(filter){
    try{
        const result = await SessionModel.deleteMany(filter);
        return result;
    }catch(exception){
        throw exception
    }
}
}
const authSvc=new AuthService()
module.exports=authSvc