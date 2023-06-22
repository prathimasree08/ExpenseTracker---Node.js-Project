const User = require("../models/user");

exports.postSignUpUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const user = await User.findOne({ where: { email: email } });
      if (user) {
        return res.status(409).json({ error: "User already exist" });
      }else{
        const result = await User.create({
            name: name,
            email: email,
            password: password,
          });
          return res.json(result);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };