/* Third Party Libraries */
const {
    validationResult
} = require("express-validator");
/* Third Party Libraries */

/* Local Files */
const Helper = require('../helpers/helper');
/* Local Files */

/* Controllers */
/* End Controllers */

class ValidationErrorCheckMiddleware {
    validate(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Helper.validationErrorMessage(res, errors.array());
        }
        next();
    }
}

module.exports = new ValidationErrorCheckMiddleware();
