const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  next();
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const expenseSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  amount: Joi.number().positive().max(9999999).required(),
  category: Joi.string().valid('food','transport','shopping','health','entertainment','utilities','other').default('other'),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  notes: Joi.string().max(500).allow('').optional(),
});

const budgetSchema = Joi.object({
  category: Joi.string().valid('food','transport','shopping','health','entertainment','utilities','other').required(),
  monthlyLimit: Joi.number().positive().max(9999999).required(),
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
});

module.exports = { validate, registerSchema, loginSchema, expenseSchema, budgetSchema };