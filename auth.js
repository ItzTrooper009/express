const auth = (req, res, next) => {
  console.log("Auth Function");
  next();
};

module.exports = auth;
