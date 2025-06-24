const nodemailer=require("nodemailer");
const { SMTPConfig } = require("../config/config");

class EmailService{
    #transport;
    constructor(){
        try{
            this.#transport=nodemailer.createTransport({
            host:SMTPConfig.host,
            port:SMTPConfig.port,
            service:SMTPConfig.provider,
            auth:{
                user:SMTPConfig.user,
                pass:SMTPConfig.password
            }
            })
            console.log("*****SMTP server connected successfully")
        }catch(exception){
            console.error("*****ERROR Connecting SMTP server")
            throw{
            code:500,
            message:"SMTP server connection error",
            status:"SMTP_CONNECTION_ERR"
        }
        }
    }

    sendEmail=async({to,sub,message,attachments=null,cc=null,bcc=null})=>{
        try{
            let emailBody={
                to:to,
                from:SMTPConfig.from,
                subject:sub,
                html:message,
            };
            if(cc){
                emailBody('cc')=cc
            }
            if(bcc){
                emailBody('bcc')=bcc
            }
            if(attachments){
                emailBody('attachments')=attachments
            }
            return await this.#transport.sendMail(emailBody)
        }catch(exception){}
    }
}
module.exports=EmailService