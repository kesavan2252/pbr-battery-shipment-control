const nodemailer = require('nodemailer');

// Configure Nodemailer (using Gmail as an example)
// For production, consider AWS SES as mentioned in the task
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use app password for Gmail (or specific password for other services)
  },
});

const sendPBRAlertEmail = async (contract) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ALERT_RECIPIENTS, // Comma-separated list of emails from .env
    subject: `PBR Contract Alert: Shipment Limit Reached for ${contract.contractId}`,
    html: `
      <p>Dear Stakeholder,</p>
      <p>This is an automated alert from the PBR Battery Shipment Monitoring System.</p>
      <p>The contract <strong>${contract.contractId}</strong> has reached its shipment threshold.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Contract ID: ${contract.contractId}</li>
        <li>Current Batteries Shipped: ${contract.batteriesShipped}</li>
        <li>Threshold: ${contract.threshold}</li>
        <li>Contract is now locked: ${contract.isLocked ? 'Yes' : 'No'}</li>
        <li>Last Updated: ${new Date(contract.lastUpdated).toLocaleString()}</li>
      </ul>
      <p>Please review the contract status in the dashboard.</p>
      <p>Thank you,</p>
      <p>PBR Monitoring System</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email alert sent for contract ${contract.contractId}`);
  } catch (error) {
    console.error(`Error sending email alert for contract ${contract.contractId}:`, error);
  }
};

module.exports = {
  sendPBRAlertEmail,
};