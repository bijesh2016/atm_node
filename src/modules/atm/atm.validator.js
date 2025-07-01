const joi=require('joi')
const phonePattern=/^(?:\+977[-\s]?)?(?:9[6-8]\d{8}|0[1-9]\d{7})$/;
const latitudePattern=/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const longitudePattern=/^[-+]?((1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/;

const AddAtmDTD=Joi.object({
    name:Joi.string().min(2).max(100),
    address:Joi.string().allow(null,"").optional().default(null),
    phone:Joi.string().allow(null,'').pattern(phonePattern).optional(),
    bank:Joi.string().required(),
    latitude:Joi.string().required().pattern(latitudePattern),
    longitude:Joi.string().required().pattern(longitudePattern),
    address:Joi.string().required().min(3).max(150),
    status:Joi.string().regex(/^(active||inactive||pending)$/).default('inactive').required(),
    branch:Joi.string().required(),
})

module.export={AddAtmDTD};