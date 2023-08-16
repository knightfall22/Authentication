const Joi = require('joi');


const userSchema = Joi.object({
            name: Joi.string().trim().required(),
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required(),
            resetToken: Joi.string(),
            resetTokenExpiration: Joi.date()
        });

const loginSchema = Joi.object({
            email: Joi.string().email().trim().required(),
            password: Joi.string().trim().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

const emailSchema = Joi.object({
            email: Joi.string().email().trim().required(),
        });

const resetSchema = Joi.object({
            token: Joi.string().trim().required(),
            password: Joi.string().trim().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirmPassword: Joi.string().trim().valid(Joi.ref('password')).required(),
        });


module.exports = {
    userSchema,
    loginSchema,
    emailSchema,
    resetSchema
}