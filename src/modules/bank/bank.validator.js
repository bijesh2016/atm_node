const joi=require('joi')
const AddBankDTD=Joi.object({
    name:Joi.string().min(2).max(100),
    email:Joi.string().email().required(),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,'').optional(),
    location:Joi.string().required(),
    address:Joi.string().required().min(3).max(150),
    phone:Joi.string().allow(null,"").optional().default(null),
    status:Joi.string().regex(/^(active|inactive)$/).default('inactive').required(),
    branch:Joi.string().required(),
    website:Joi.string().required()
})
