const EmailService = require("../../services/mail.service");
const { AppConfig } = require("../../config/config");

class AuthMail{
    svc;
    constructor(mailSvc){
        this.svc=new EmailService()
    }
notifyUserRegistration=async(user)=>{
    try{
        const activationLink = `${AppConfig.appUrl}/auth/activate/${user.activationToken}`;
        const emailTemplate = `
            <h2>Welcome to ATM Locator!</h2>
            <p>Hi ${user.name},</p>
            <p>Thank you for registering with us. Please click the link below to activate your account:</p>
            <a href="${activationLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Activate Account</a>
            <p>This link will expire in 3 hour.</p>
            <p>If you didn't create this account, please ignore this email.</p>
        `;
        await this.svc.sendEmail({
            to:user.email,
            sub:"Activate your account!",
            message:emailTemplate
        })
    }catch(exception){
        throw exception
    }
}
notifyActivationSuccess=async(user)=>{
    try{
        const loginLink=`${AppConfig.appUrl}/login`;
        const emailTemplate=`
            <h2>Account Activated Successfully!</h2>
            <p>Hi ${user.name},</p>
            <p>Your account has been activated successfully. You can now login to your account.</p>
            <a href="${loginLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Login Now</a>
            <p>Welcome to ATM Locator!</p>
        `;
        await this.svc.sendEmail({
            to:user.email,
            sub:"Welcome to ATM Locator",
            message:emailTemplate
        })
    }catch(exception){
        throw exception
    }
}

}
const AuthMailSvc=new AuthMail()
module.exports=AuthMailSvc