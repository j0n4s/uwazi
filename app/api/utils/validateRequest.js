import Joi from 'joi';
import createError from './Error';

export default (schema, propTovalidate = 'body') => (req, res, next) => {
  const result = Joi.validate(req[propTovalidate], schema);
  if (result.error) {
    next(createError(result.error.toString(), 400));
  }

  if (!result.error) {
    next();
  }
};
