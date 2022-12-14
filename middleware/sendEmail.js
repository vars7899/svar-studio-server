const SibApiV3Sdk = require("sib-api-v3-sdk");

function sendEmailToClient(
  givenSenderName,
  givenSender,
  givenReceiver,
  givenSubject,
  givenContent
) {
  // Email service
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const ApiKey = defaultClient.authentications["api-key"];
  ApiKey.apiKey = process.env.SENDIN_BLUE_API;
  const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = {
    name: givenSenderName,
    email: givenSender,
  };
  const receivers = [{ email: givenReceiver }];

  transEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: givenSubject,
      htmlContent: givenContent,
    })
    .then(console.log)
    .catch(console.log);
}

module.exports = sendEmailToClient;
