const nodemailer = require("nodemailer");

const sendMail = async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    logger: true,
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Verification Failed:", error);
    } else {
      console.log("SMTP Server is ready:", success);
    }
  });

  const info = await transporter.sendMail({
    from: `"Restaurant to you" <${process.env.EMAIL_NAME}>`, // sender address
    to: email, // list of receivers
    subject: "Forgot password", // Subject line
    html, // html body
  });

  return info;
};

module.exports = sendMail;
