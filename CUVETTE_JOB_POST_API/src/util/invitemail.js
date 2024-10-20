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
    pass
  },
});

async function sendInvite(candidateMails, message) {
  // send mail with defined transport object
  let info;

  

  const mails = candidateMails.map(async (candidateMail) => {
    info = await transporter.sendMail({
      from: '"Cuvette" <mr.zala2003@gmail.com>', // sender address
      to: `${candidateMail}`, // list of receivers
      subject: message.subject, // Subject line
      text: message.message,
    });
  });

  Promise.all(mails).then(() => {
    console.log(info.message);
  });
}

//#endregion

export default sendInvite;
