import {MailtrapClient} from "mailtrap"
import dotenv from "dotenv"

dotenv.config({
  path: "../.env"
});


const TOKEN = process.env.MAIL_TRAP_TOKEN;
const ENDPOINT= process.env.MAIL_TRAP_ENDPOINT
console.log("this is the token", TOKEN)

export const mailTrapclient = new MailtrapClient({
  token: TOKEN,
  endpoint:ENDPOINT
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Rohit Singh",
};
