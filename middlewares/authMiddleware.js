const User = require("../model/usersModel");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./errorHandler")

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt || req.body.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const user = await User.findById(decoded.id); 
          console.log("decoded",decoded)
          user.password = undefined
          if (user) res.json({ status: true, user: user });
          else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};


module.exports.authorizedRoles = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.body.role)) {
			new ErrorHandler("You are not authorized!", 403)
		}
		next()
	}
}