import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import nodemailer from "nodemailer";

//#region mail sender

const user = process.env.APPLICATION_EMAIL;
const pass = process.env.APPLICATION_SPECIFIC_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user,
    pass,
  },
});

async function sendOTPMail(companyMail, otp) {


  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `Cuvette <${process.env.APPLICATION_EMAIL}>`, // sender address
    to: `${companyMail}`, // list of receivers
    subject: "Verification of your email", // Subject line
    text: `Hi,

Greetings from Cuvette!

Please enter the below OTP on website to verify your email.

Your OTP is - ${otp}

If you are facing any issue to verify your email id please contact us.

Regards,
Team Cuvette`,
  });
}

//#endregion

export { sendOTPMail };
