// @desc      Logs request to console
const logger = (req, res, next) => {
 
  next();
};

module.exports = logger;
