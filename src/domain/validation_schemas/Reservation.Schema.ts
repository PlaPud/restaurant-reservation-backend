import Joi from "joi";

export const newReserveSchema = Joi.object({
  restaurantId: Joi.string().required(),
  seats: Joi.number().required(),
  reserveDate: Joi.date().required(),
});

export const updateReserveSchema = Joi.object({
  customerId: Joi.string(),
  restaurantId: Joi.string().required(),
  date: Joi.date().required(),
  seats: Joi.number(),
  reserveDate: Joi.date().required(),
  payImgUrl: Joi.string().required(),
  isPayed: Joi.boolean().required(),
  isAttended: Joi.boolean().required(),
});
