import Joi from "joi";

export const createCustomerSchema = Joi.object({
  fName: Joi.string().required(),
  lName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{9,10}$")).required(),
  password: Joi.string().required(),
});

export const updateCustomerSchema = Joi.object({
  fName: Joi.string().required(),
  lName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{9,10}$")).required(),
});
