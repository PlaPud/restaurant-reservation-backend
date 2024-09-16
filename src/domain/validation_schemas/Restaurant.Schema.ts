import Joi from "joi";

export const restaurantSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  email: Joi.string().email().required(),
  description: Joi.string().required(),
  password: Joi.string().required(),
});
