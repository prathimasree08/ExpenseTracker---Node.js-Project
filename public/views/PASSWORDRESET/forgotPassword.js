const User = require("../models/user");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;
const sender = {
  email: "prathimasree99@gmail.com",
  name: "Prathimasree",
};

exports.ForgotPassword = async (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(409).json({ error: "User not exist" });
    } else {
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const receivers = [
        {
          email: email,
        },
      ];
      const response = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Password Reset Link",
        textContent: `Please click on the link to reset your password.`,
        htmlContent: `<p>Please click the link below to reset your password.
                if not done by you, please change your password</p> 
                <a href="http://127.0.0.1:5500/FrontEnd/Login/login.html">Reset link</a>`,
      });
      console.log(response);
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ error: "User does not exists" });
  }
};