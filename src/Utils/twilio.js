const twilio = require("twilio");

// Retrieve Twilio credentials (add these to your environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

async function createService() {
  const service = await client.verify.v2.services.create({
    friendlyName: "My Verify Service",
  });
  console.log("Service SID:", service.sid);
}

// createService();


async function createVerification(phone_no) {
    try {
        const verification = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({
                channel: "sms",
                to: `+91${phone_no}`,
            });
        console.log(verification);
        return verification;
    } catch (error) {
        console.error("Error in creating verification:", error);
        throw error;
    }
}

async function createVerificationCheck(code, phone_no) {
    try {
        console.log(client)
        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({
                code: code,
                to: `+91${phone_no}`,
            });
        // console.log(verificationCheck);
        return verificationCheck;
    } catch (error) {
        console.error("Error in verification check:", error);
        throw error;
    }
}




module.exports = {client, createVerification, createVerificationCheck};

