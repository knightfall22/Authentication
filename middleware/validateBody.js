const Joi = require('joi');

module.exports = (schema) => (req, res, next) => {
      const { error } = schema.validate(req.body, {abortEarly: false});
      if (error) {
        console.log(error);
        // Joi validation failed
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).send({ error: errorMessage });
      }
      next();
};
