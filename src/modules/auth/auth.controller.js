const userSvc = require("../../modules/user/user.service");
const authMailSvc = require("./auth.mail");
const { AppConfig } = require("../../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { randomStringGenerate } = require("../../utilities/helpers");
const { Status } = require("../../config/constant");
const uploader = require("../../middlewares/file-upload.middleware");

const ADMIN_CREDENTIALS = {
  email: "superadmin@gmail.com",
  password: "Admin@123", 
};

class AuthController {
  register = async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Password and confirm password do not match.",
          status: "PASSWORD_MISMATCH",
        });
      }
      const data = await userSvc.transformUserRegister(req);
      const user = await userSvc.userRegister(data);
      await authMailSvc.notifyUserRegistration(user);
      res.status(200).json({
        message: "User has been created. Please check your email for verification.",
        status: "SUCCESS",
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userSvc.getSingleRowByFilter({ email });
      if (!user) {
        return res.status(404).json({
          message: "No user found!",
          status: "USER_NOT_FOUND",
        });
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          message: "Bad Password",
          status: "CREDENTIALS_DONOT_MATCH",
        });
      }

      if (user.status !== Status.ACTIVE || user.activationToken !== null) {
        return res.status(422).json({
          message: "Account not activated yet",
          status: "NOT_ACTIVATED",
        });
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.role === 'admin' },
        AppConfig.jwtSecret,
        { expiresIn: "1d" }
      );

      // Update last login timestamp
      await userSvc.updateUser(user._id, { lastLogin: new Date() });
      
      const { password: _, role, ...otherDetails } = user._doc || user;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: AppConfig.env === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login Successful",
          status: "LOGIN_SUCCESS",
          details: { 
            ...otherDetails,
            lastLogin: new Date() // Include the last login time in the response
          },
          isAdmin: role === 'admin',
        });
    } catch (error) {
      next(error);
    }
  };

  getLoggedInUserProfile = (req, res, next) => {
    try {
      const user = req.loggedInUser;
      const { password: _, ...otherDetails } = user._doc || user;
      res.json({
        message: "Your Profile",
        status: "OK",
        details: { ...otherDetails },
        isAdmin: user.role === 'admin',
      });
    } catch (exception) {
      next(exception);
    }
  };

  // activateUserProfile = async (req, res, next) => {
  //   try {
  //     let token = req.params.token;
  //     const userDetail = await userSvc.getSingleRowByFilter({
  //       activationToken: token,
  //     });

  //     if (!userDetail) {
  //       return res.status(422).json({
  //         message: "User not found",
  //         status: "USER_DOES_NOT_EXISTS",
  //       });
  //     }
  //     let expiryTime = userDetail.expiryTime.getTime();
  //     let todayTime = Date.now();

  //     if (todayTime > expiryTime) {
  //       userDetail.activationToken = randomStringGenerate(15);
  //       userDetail.expiryTime = new Date(Date.now() + 60 * 60 * 3 * 1000);
  //       await userDetail.save();
  //       await authMailSvc.notifyUserRegistration(userDetail);
  //       res.json({
  //         message: "A new verification link has been sent to your registered account",
  //         status: "RESENT_VERIFICATION_LINK",
  //       });
  //     } else {
  //       userDetail.activationToken = null;
  //       userDetail.expiryTime = null;
  //       userDetail.status = Status.ACTIVE;
  //       await userDetail.save();
  //       await authMailSvc.notifyActivationSuccess(userDetail);
  //       res.json({
  //         message: "Your account has been activated successfully. Please login to continue...",
  //         status: "ACCOUNT_ACTIVATED",
  //       });
  //     }
  //   } catch (exception) {
  //     next(exception);
  //   }
  // };

activateUserProfile = async (req, res, next) => {
  try {
    let token = req.params.token;
    console.log('Activation attempt for token:', token);
    const userDetail = await userSvc.getSingleRowByFilter({
      activationToken: token,
    });
    console.log('User found for activation:', userDetail);

    if (!userDetail) {
      console.log('No user found for token');
      return res.redirect('http://localhost:5173/auth?error=User not found');
    }
    let expiryTime = userDetail.expiryTime.getTime();
    let todayTime = Date.now();
    console.log('Expiry time:', expiryTime, 'Current time:', todayTime);

    if (todayTime > expiryTime) {
      userDetail.activationToken = randomStringGenerate(15);
      userDetail.expiryTime = new Date(Date.now() + 60 * 60 * 3 * 1000);
      await userDetail.save();
      await authMailSvc.notifyUserRegistration(userDetail);
      console.log('Token expired, new token sent');
      return res.redirect('http://localhost:5173/auth?message=A new verification link has been sent to your email');
    } else {
      userDetail.activationToken = null;
      userDetail.expiryTime = null;
      userDetail.status = Status.ACTIVE;
      console.log('About to save user as active:', userDetail);
      await userDetail.save();
      console.log('User activated and saved successfully');
      await authMailSvc.notifyActivationSuccess(userDetail);
      // Auto-login: generate JWT and set cookie
      const jwtToken = jwt.sign(
        { id: userDetail._id, isAdmin: userDetail.role === 'admin' },
        AppConfig.jwtSecret,
        { expiresIn: "1d" }
      );
      res.cookie("access_token", jwtToken, {
        httpOnly: true,
        secure: AppConfig.env === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.redirect('http://localhost:5173/');
    }
  } catch (exception) {
    console.error('Activation error:', exception);
    next(exception);
  }
};




  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await userSvc.getSingleRowByFilter({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: "USER_NOT_FOUND",
        });
      }
      const resetToken = randomStringGenerate(15);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();
      await authMailSvc.notifyPasswordReset(user);
      res.json({
        message: "Password reset link sent to your email.",
        status: "FORGOT_PASSWORD_SUCCESS",
      });
    } catch (exception) {
      next(exception);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const user = await userSvc.getSingleRowByFilter({ _id: userId });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          status: "USER_NOT_FOUND",
        });
      }
      const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(422).json({
          message: "Old password is incorrect",
          status: "OLD_PASSWORD_INCORRECT",
        });
      }
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      res.json({
        message: "Password changed successfully.",
        status: "CHANGE_PASSWORD_SUCCESS",
      });
    } catch (exception) {
      next(exception);
    }
  };


    showResetPasswordForm = async (req, res, next) => {
    try {
      const { token } = req.params;
      
      const user = await userSvc.getSingleRowByFilter({ resetPasswordToken: token });
      if (!user) {
        return res.redirect('http://localhost:5173/auth?error=Invalid or expired reset token');
      }

      if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
        return res.redirect('http://localhost:5173/auth?error=Reset token has expired');
      }

      // Show a simple HTML form for password reset
      const htmlForm = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reset Password - ATM Locator</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { background: #0d6efd; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0b5ed7; }
            .error { color: red; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h2>Reset Your Password</h2>
          <form method="POST" action="/api/atm_locator/auth/reset-password/${token}">
            <div class="form-group">
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" required minlength="6">
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
            </div>
            <button type="submit">Reset Password</button>
          </form>
          <script>
            document.querySelector('form').addEventListener('submit', function(e) {
              const password = document.getElementById('newPassword').value;
              const confirm = document.getElementById('confirmPassword').value;
              if (password !== confirm) {
                e.preventDefault();
                alert('Passwords do not match!');
              }
            });
          </script>
        </body>
        </html>
      `;
      
      res.send(htmlForm);
    } catch (error) {
      console.error('Show Reset Password Form Error:', error);
      res.redirect('http://localhost:5173/auth?error=Server error');
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

    const user = await userSvc.getSingleRowByFilter({ resetPasswordToken: token });
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token', status: 'NOT_FOUND' });
    }

    if (user.resetPasswordExpires && new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ message: 'Reset token has expired', status: 'TOKEN_EXPIRED' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Auto-login: generate JWT and set cookie
    const jwtToken = jwt.sign(
      { id: user._id, isAdmin: user.role === 'admin' },
      AppConfig.jwtSecret,
      { expiresIn: "1d" }
    );
    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: AppConfig.env === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.redirect('http://localhost:5173/');
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error', status: 'SERVER_ERROR' });
  }
};

  logout = async (req, res, next) => {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: AppConfig.env === 'production',
        sameSite: 'strict',
        path: '/', 
      });
      
      res.json({
        message: "Logged out successfully",
        status: "LOGOUT_SUCCESSFUL",
      });
    } catch (exception) {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: AppConfig.env === 'production',
        sameSite: 'strict',
        path: '/',
      });
      
      res.json({
        message: "Logged out successfully",
        status: "LOGOUT_SUCCESSFUL",
      });
    }
  };

  adminLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const ADMIN_CREDENTIALS = {
        email: "superadmin@gmail.com",
        password: "Admin@123"
      };
      
      if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
        return res.status(401).json({
          message: "Invalid admin credentials",
          status: "INVALID_CREDENTIALS",
        });
      }

      const adminUser = {
        _id: "admin_user_id",
        name: "Admin User",
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        status: Status.ACTIVE,
        image: null,
        gender: null,
        address: null,
        dob: null,
        phone: null
      };

      const token = jwt.sign(
        { id: adminUser._id, isAdmin: true, role: 'admin' },
        AppConfig.jwtSecret,
        { expiresIn: "1d" }
      );

      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: AppConfig.env === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, 
        })
        .status(200)
        .json({
          message: "Admin login successful",
          status: "ADMIN_LOGIN_SUCCESS",
          details: adminUser,
          isAdmin: true,
        });
    } catch (error) {
      next(error);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;