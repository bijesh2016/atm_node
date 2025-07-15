const Joi=require('joi')
const phonePattern=/^(?:\+977[-\s]?)?(?:9[6-8]\d{8}|0[1-9]\d{7})$/;
const latitudePattern=/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
const longitudePattern=/^[-+]?((1[0-7]\d|[1-9]?\d)(\.\d+)?|180(\.0+)?)$/;

const AddAtmDTD=Joi.object({
    name:Joi.string().min(2).max(250).required(),
    address:Joi.string().min(3).max(150).required(),
    phone:Joi.string().allow(null,'').pattern(phonePattern).optional(),
    bank:Joi.string().required(),
    latitude:Joi.number().required().min(-90).max(90),
    longitude:Joi.number().required().min(-180).max(180),
    status:Joi.string().regex(/^(active|inactive|pending)$/).default('inactive').required(),
    branch:Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
    ).required(),
})

module.exports = { AddAtmDTD };