const bodyValidator = (rules) => {
  return async (req, res, next) => {
    try {
      const payload = req.body;
      if (!payload) {
        throw {
          code: 422,
          message: "data not provided",
          status: "VALIDATION_FAILED_ERR"
        };
      }

      await rules.validateAsync(payload, { abortEarly: false });
      next(); 

    } catch (exception) {
      let error = {
        code: 400,
        error: "Validation Failed", // changed from 'msg' to 'error' for clarity
        status: "VALIDATION_FAILED",
        details: {}
      };

      if (exception.details && Array.isArray(exception.details)) {
        exception.details.forEach((errorObj) => {
          let field = errorObj.path.join(".");
          error.details[field] = errorObj.message;
        });
      } else if (exception.message) {
        // fallback: if no details, provide the main message
        error.details.general = exception.message;
      }

      console.error("Validation Error:", error);
      res.status(400).json(error); 
    }
  };
};

module.exports = bodyValidator;
