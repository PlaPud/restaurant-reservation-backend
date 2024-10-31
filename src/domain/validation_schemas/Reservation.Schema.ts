import Joi from "joi";

export const newReserveSchema = Joi.object({
  restaurantId: Joi.string().required(),
  seats: Joi.number().min(1).required(),
  reserveDate: Joi.number().required(),
  reservePrice: Joi.number().min(0).required(),
});

export const updateReserveSchema = Joi.object({
  customerId: [Joi.string().allow(""), Joi.allow(null)],
  reserveId: Joi.string().required(),
  restaurantId: Joi.string().required(),
  lastModified: Joi.number(),
  seats: Joi.number().min(1).required(),
  reserveDate: Joi.number().required(),
  reservePrice: Joi.number().min(0).required(),
  payImgUrl: Joi.string().allow(""),
  isPayed: Joi.boolean().required(),
  isAttended: Joi.boolean().required(),
});
