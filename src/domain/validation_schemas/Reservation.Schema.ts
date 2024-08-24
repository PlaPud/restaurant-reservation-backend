import Joi from "joi";

export const newReserveSchema = Joi.object({
  restaurantId: Joi.string().required(),
  seats: Joi.number().required(),
  reserveDate: Joi.date().required(),
});

export const updateReserveSchema = Joi.object({
  customerId: Joi.string().allow(""),
  restaurantId: Joi.string().required(),
  lastModified: Joi.date(),
  seats: Joi.number(),
  reserveDate: Joi.date().required(),
  payImgUrl: Joi.string().allow(""),
  isPayed: Joi.boolean().required(),
  isAttended: Joi.boolean().required(),
});
