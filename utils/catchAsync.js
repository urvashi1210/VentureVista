module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
    //err=>err.next means the same as next here as in es6, next will be called with the parameter
  };
};
