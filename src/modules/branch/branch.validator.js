const joi=require('joi')
const AddBranchDTD=Joi.object({
    name:Joi.string().min(2).max(100),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,'').optional(),
    bank:Joi.string().required(),
    location:Joi.string().required(),
    status:Joi.string().regex(/^(active|inactive)$/).default('inactive').required(),
    branch:Joi.string().required(),
    services:Joi.string().optional()
})
