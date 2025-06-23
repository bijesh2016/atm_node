const joi=require('joi')
const AddAtmDTD=Joi.object({
    name:Joi.string().min(2).max(100),
    email:Joi.string().email().required(),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,'').optional()
})
