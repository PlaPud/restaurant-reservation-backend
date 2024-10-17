import Joi from "joi";

export const createRestaurantSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{9,10}$")).required(),
  address: Joi.string().required(),
  subDistrict: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{9,10}$")).required(),
  address: Joi.string().required(),
  subDistrict: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  email: Joi.string().email().required(),
  description: Joi.string().allow(""),
  paymentInfo: Joi.string().allow(""),
});
