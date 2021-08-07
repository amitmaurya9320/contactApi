const joi = require("@hapi/joi");

const registerSchema = joi.object({
  userName: joi.string().required().max(150).min(1),
  firstName: joi.string().required().min(2).max(255),
  lastName: joi.string().required().min(2).max(255),
  email: joi.string().email().lowercase().min(4).max(255),
  password: joi.string().min(6).max(65).required(),
});

const loginSchema = joi.object({
  userName: joi
    .string()
    .required()

    .max(150)
    .min(1),
  password: joi.string().min(6).max(65).required(),
});

const contactSchema = joi.object({
  countryCode: joi.string().max(30).min(1).required(),
  firstName: joi.string().max(30).min(1).required(),
  lastName: joi.string().max(30).min(1).required(),
  phoneNumber: joi.string().max(30).min(1).required(),
  contactPicture: joi.string().max(200).min(1),
  isFavorite: joi.boolean(),
  owner: joi.string().required(),
});

const updateContactSchema = joi.object({
  countryCode: joi.string().max(30).min(1),
  firstName: joi.string().max(30).min(1),
  lastName: joi.string().max(30).min(1),
  phoneNumber: joi.string().max(30).min(1),
  contactPicture: joi.string().max(200).min(1),
  isFavorite: joi.boolean(),
});
module.exports = {
  registerSchema,
  loginSchema,
  contactSchema,
  updateContactSchema,
};
