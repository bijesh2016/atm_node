const EmailService = require("../../services/mail.service");
const { AppConfig } = require("../../config/config");

class AuthMail {
  svc;
  constructor(mailSvc) {
    this.svc = new EmailService();
  }
  notifyUserRegistration = async (user) => {
    try {
      const backendActivationLink = `http://localhost:9000/api/atm_locator/auth/activate/${user.activationToken}`;
      const frontendActivationLink = `${AppConfig.appUrl}/auth/activate/${user.activationToken}`;
      const emailTemplate = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #0d6efd; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0;">ATM Locator</h1>
        <p style="margin: 5px 0 0;">Your trusted ATM and bank finder</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #333;">Welcome, ${user.name}!</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for registering with <strong>ATM Locator</strong>. We’re excited to have you on board.
        </p>
        <p style="font-size: 16px; color: #555;">
          To complete your registration, please verify your email by clicking <b>either</b> of the buttons below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${backendActivationLink}" style="background-color: #0d6efd; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; margin-right: 10px;">
            Activate via Backend (Recommended)
          </a>
          <a href="${frontendActivationLink}" style="background-color: #198754; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; margin-left: 10px;">
            Activate via Frontend
          </a>
        </div>

        <p style="font-size: 14px; color: #999;">
          This link will expire in <strong>3 hours</strong>. If you didn’t create this account, you can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 20px; font-size: 13px;">
        &copy; ${new Date().getFullYear()} ATM Locator. All rights reserved.<br/>
        <a href="#" style="color: #0d6efd; text-decoration: none;">Visit our website</a> | 
        <a href="#" style="color: #0d6efd; text-decoration: none;">Contact Support</a>
      </div>
    </div>
  </div>
`;
      await this.svc.sendEmail({
        to: user.email,
        sub: "Activate your account!",
        message: emailTemplate,
      });
    } catch (exception) {
      throw exception;
    }
  };


  notifyActivationSuccess = async (user) => {
    try {
      const loginLink = `${AppConfig.appUrl}/auth/login/`;
      const emailTemplate = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #28a745; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0;">ATM Locator</h1>
        <p style="margin: 5px 0 0;">Account Activated</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #333;">Hi ${user.name},</h2>
        <p style="font-size: 16px; color: #555;">
          🎉 Great news! Your account has been <strong>successfully activated</strong>. You can now log in and start using ATM Locator to find the nearest ATMs and banks instantly.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginLink}" style="background-color: #28a745; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Login Now
          </a>
        </div>

        <p style="font-size: 14px; color: #999;">
          If you have any questions or need help, feel free to reach out to our support team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 20px; font-size: 13px;">
        &copy; ${new Date().getFullYear()} ATM Locator. All rights reserved.<br/>
        <a href="#" style="color: #28a745; text-decoration: none;">Visit our website</a> | 
        <a href="#" style="color: #28a745; text-decoration: none;">Contact Support</a>
      </div>

    </div>
  </div>
`;
      await this.svc.sendEmail({
        to: user.email,
        sub: "Welcome to ATM Locator",
        message: emailTemplate,
      });
    } catch (exception) {
      throw exception;
    }
  };
  notifyPasswordReset = async (user) => {
    try {
      const backendResetLink = `http://localhost:9000/api/atm_locator/auth/reset-password/${user.resetPasswordToken}`;
      const frontendResetLink = `${AppConfig.appUrl}/reset-password/${user.resetPasswordToken}`;
      const emailTemplate = `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background-color: #dc3545; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0;">ATM Locator</h1>
        <p style="margin: 5px 0 0;">Password Reset Request</p>
      </div>
      <!-- Body -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #333;">Hello, ${user.name}!</h2>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password for your <strong>ATM Locator</strong> account.
        </p>
        <p style="font-size: 16px; color: #555;">
          To reset your password, please click <b>either</b> of the buttons below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${backendResetLink}" style="background-color: #dc3545; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; margin-right: 10px;">
            Reset via Backend (Recommended)
          </a>
          <a href="${frontendResetLink}" style="background-color: #198754; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px; margin-left: 10px;">
            Reset via Frontend
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">
          This link will expire in <strong>1 hour</strong>. If you didn't request this password reset, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #999;">
          For security reasons, please do not share this email with anyone.
        </p>
      </div>
      <!-- Footer -->
      <div style="background-color: #f1f1f1; color: #888; text-align: center; padding: 20px; font-size: 13px;">
        &copy; ${new Date().getFullYear()} ATM Locator. All rights reserved.<br/>
        <a href="#" style="color: #dc3545; text-decoration: none;">Visit our website</a> | 
        <a href="#" style="color: #dc3545; text-decoration: none;">Contact Support</a>
      </div>
    </div>
  </div>
`;
      await this.svc.sendEmail({
        to: user.email,
        sub: "Reset your ATM Locator password",
        message: emailTemplate,
      });
    } catch (exception) {
      throw exception;
    }
  };
}
const AuthMailSvc = new AuthMail();
module.exports = AuthMailSvc;

