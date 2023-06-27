const log = (req, res, next) => {
  console.log("Logger Function");
  next();
};

module.exports = log;
