
import { VERIFICATION_EMAIL_TEMPLATE } from "./EmailTemplate.js";
import { mailTrapclient, sender } from "./Mailtrap.config.js";

export const SendVerificationEmail = async(email, verificationCode) => {
  const recipient = [{email}]
  try{

    const response = await mailTrapclient.send({
      from: sender,
      to: recipient,
      subject: "Verification of account",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
      category: "email verification"
    })
    
    console.log("Email sent successfully !", response)

  }catch(err) {
    console.log("something went wrong !")
    throw new Error(`Error sending the verification${err}`)
    
  }

}