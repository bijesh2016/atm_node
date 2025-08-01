const Joi=require('joi')
const phonePattern=/^(?:\+977[-\s]?)?(?:9[6-8]\d{8}|0[1-9]\d{7})$/;
const latitudePattern=/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const longitudePattern=/^[-+]?((1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/;

const AddBankDTD=Joi.object({
    name:Joi.string().min(2).max(100),
    email:Joi.string().email().required(),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,'').pattern(phonePattern).optional(),
    latitude:Joi.string().required().pattern(latitudePattern),
    longitude:Joi.string().required().pattern(longitudePattern),
    code: Joi.string().required(),
    phone:Joi.string().allow(null,"").optional().default(null), 
    status:Joi.string().regex(/^(active||inactive||pending)$/).default('inactive').required(),
    branch:Joi.string().required(),
    website:Joi.string().optional(),
    image:Joi.string().allow(null,"").optional().default(null),
    province:Joi.string().allow(null,"").optional().default(null),
    district:Joi.string().allow(null,"").optional().default(null),
})

module.exports={AddBankDTD}