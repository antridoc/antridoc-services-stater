const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../model/User");
const UserRole = require("../model/Role");
// validation
const { registerValidation, loginValidation, forgotPasswordValidation } = require("../validation");


const generateTokenVerify = function (user) {
  return jwt.sign(
    // payload data
    {
      name: user.name,
      id: user._id,
      verify: user.verified,
    },
    process.env.TOKEN_SECRET
  );
}

module.exports = {

  register: async (req, res) => {
    // validate the user
    const { error } = registerValidation(req.body);

    // throw validation errors
    if (error) return res.status(400).json({ error: error.details[0].message });

    const isEmailExist = await User.findOne({ email: req.body.email });

    // throw error when email already registered
    if (isEmailExist)
      return res.status(400).json({ error: "Email already exists" });

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password,
    });

    try {
      const defaultUserRole = await UserRole.findOne({slug: 'patien'});
      user.role = defaultUserRole;
      const savedUser = await user.save();
      const verifyEmailToken = savedUser.generateVerifyEmailToken();
      res.json({ error: null, data: { userId: savedUser._id } });
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  login: async (req, res) => {
    // validate the user
    const { error } = loginValidation(req.body);

    // throw validation errors
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    // throw error when email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });

    // check for password correctness
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Password is wrong" });

    const token = generateTokenVerify(user);
    res.header("auth-token", token).json({
      error: null,
      data: {
        token,
      },
    });
  },

  verifyEmail: async (req, res) => {
    const token = req.query.token;
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      const user = await User.findOne({email: verified.email});
      if (!user || verified.slug != 'antridoc-email-token') return res.status(400).json({ error: "Token not valid" });
      
      user.verified = true;
      const updatedUser = await user.save();
      
      res.status(200).json({error: null, data: {userId: updatedUser._id}});    
    } catch (err) {
      res.status(400).json({ error: "Token is not valid" });
    }
  },

  resendVerifyEmail: async (req, res) => {
    try{
      const user = await User.findOne({_id: req.currentUser.id});
      res.status(200).json({error: null, data: {emailToken: user.generateVerifyEmailToken()}});
    } catch (err) {
      res.status(400).json(err);
    }
  },

  forgotPassword: async (req, res) => {
    try{
      const user = await User.findOne({email: req.body.email});
      res.status(200).json({error: null, data: {resetPasswordToken: user.generateForgotPasswordToken()}});
    } catch (err) {
      res.status(400).json(err);
    }
  },

  resetPassword: async (req, res) => {
    const token = req.query.resetPasswordToken;
    if (!token) return res.status(401).json({ error: "Access denied" });

    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      const user = await User.findOne({email: verified.email});
      if (!user || verified.slug != 'antridoc-forgot-password-token') return res.status(400).json({ error: "Token not valid" });
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      const updatedUser = await user.save();
      
      res.status(200).json({error: null, data: {userId: updatedUser._id}});    
    } catch (err) {
      res.status(400).json({ error: "Token is not valid" });
    }
  },
}