const Joi = require("joi");
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const registerUserDTD=Joi.object({
    name:Joi.string().min(2).max(50),
    email:Joi.string().email().required(),
    password:Joi.string()
        .pattern(strongPasswordPattern)
        .required()
        .messages({
            "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        }),
    confirmPassword:Joi.ref('password'),
    role:Joi.string().regex(/^(admin|customer)$/).optional().default('customer'),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,"").optional().default(null),
    gender:Joi.string().regex(/^(male|female|others)$/)
    .required(),
    dob:Joi.date().less("now"),
    image:Joi.string().allow(null,"").optional().default(null),
})

const LoginDTD=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
})

module.exports={registerUserDTD,LoginDTD}