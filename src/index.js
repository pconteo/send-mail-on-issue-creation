const core = require('@actions/core');
const nodemailer = require('nodemailer');

async function run() {
  try {
    // Legge input dalla Action
    const smtpHost = core.getInput('smtp-host');        // es. smtp.gmail.com
    const smtpPort = parseInt(core.getInput('smtp-port')); // es. 465
    const smtpUser = core.getInput('smtp-user');        // email completa
    const smtpPass = core.getInput('smtp-pass');        // password o App Password
    const toEmail = core.getInput('to-email');          // destinatario
    const subject = core.getInput('subject') || 'GitHub Action Email';
    const body = core.getInput('body') || 'Hello from GitHub Action!';

    // Crea il transporter SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true per 465, false per altri
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Invia la mail
    const info = await transporter.sendMail({
      from: smtpUser,
      to: toEmail,
      subject: subject,
      text: body,
    });

    console.log(`Email inviata: ${info.messageId}`);
    core.setOutput('message-id', info.messageId);

  } catch (error) {
    core.setFailed(`Errore nell'invio della mail: ${error.message}`);
  }
}

run();
