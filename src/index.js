const core = require('@actions/core');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

async function run() {
  try {
    // Input dalla Action
    const clientId = core.getInput('client-id');
    const clientSecret = core.getInput('client-secret');
    const refreshToken = core.getInput('refresh-token');
    const userEmail = core.getInput('user-email');
    const toEmail = core.getInput('to-email');
    const subject = core.getInput('subject') || 'Nuova email da GitHub Action';
    const body = core.getInput('body') || 'Ciao! Questa è una email inviata dalla GitHub Action.';

    // Setup OAuth2
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground' // redirectUri
    );
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const accessToken = await oAuth2Client.getAccessToken();

    // Configura nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: userEmail,
        clientId,
        clientSecret,
        refreshToken,
        accessToken: accessToken.token,
      },
    });

    // Invia la mail
    const info = await transporter.sendMail({
      from: `GitHub Action <${userEmail}>`,
      to: toEmail,
      subject,
      text: body,
    });

    console.log(`Email inviata: ${info.messageId}`);
    core.setOutput('message-id', info.messageId);

  } catch (error) {
    core.setFailed(`Errore nell'invio della mail: ${error.message}`);
  }
}

run();
