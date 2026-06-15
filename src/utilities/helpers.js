const fs=require("fs");
const deleteFile=async(filepath)=>{
    if(fs.existsSync(filepath)){
        return fs.unlinkSync(filepath)
    }
    return false
}

const randomStringGenerate=(length=100)=>{
    const chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const len=chars.length
    let randomStr="";
    for(let i=0;i<length;i++){
        const posn=Math.floor(Math.random()*(len-1))
        randomStr+=chars[posn]
    }
    return randomStr
}
module.exports={
    deleteFile,
    randomStringGenerate
}

