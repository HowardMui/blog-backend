import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
require("dotenv").config();

const REGION = "ap-southeast-2";
const ses = new SESClient({ region: REGION });

const createSendEmailCommand = (toAddress: string, fromAddress: string, message: string) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "One time password for register to twitter",
      },
    },
    Source: fromAddress,
  });
};

export const sendEmailToken = async (toAddress: string, token: string) => {
  try {
    const message = `Your one time password: ${token}`;
    const sendEmailCommand = createSendEmailCommand(toAddress, "mhw19972013@gmail.com", message);
    return await ses.send(sendEmailCommand);
  } catch (err) {
    console.log(err);
    return err;
  }
};
