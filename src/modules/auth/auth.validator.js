const Joi = require("joi");
const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const registerUserDTD = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(strongPasswordPattern).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  }),
  confirmPassword: Joi.ref("password"),
  phone: Joi.string().required(),
  gender: Joi.string().valid("male", "female","others").required(),
 role:Joi.string().regex(/^(admin|user)$/).optional().default('customer'),  address:Joi.string().allow(null,"").optional().default(null),
  dob:Joi.date().less("now"),
  image:Joi.string().allow(null,"").optional().default(null),
});


const LoginDTD = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const ForgotPasswordDTD = Joi.object({
  email: Joi.string().email().required(),
});

const ChangePasswordDTD = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(strongPasswordPattern).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
  }),
  confirmPassword: Joi.ref("newPassword"),
});

module.exports = { registerUserDTD, LoginDTD, ForgotPasswordDTD, ChangePasswordDTD };
