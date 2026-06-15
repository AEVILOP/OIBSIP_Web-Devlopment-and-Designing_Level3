const nodemailer = require('nodemailer');
const templates = require('./emailTemplates');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(`Email skipped (${subject}): Gmail credentials are not configured`);
    return false;
  }

  try {
    await getTransporter().sendMail({
      from: `"PizzaApp" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error(`Email delivery failed (${subject}):`, error.message);
    return false;
  }
};

const sendVerificationEmail = (user, token) => sendEmail({
  to: user.email,
  subject: 'Verify your PizzaApp account',
  html: templates.verificationEmail(
    user.name,
    `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`,
  ),
});

const sendWelcomeEmail = (user) => sendEmail({
  to: user.email,
  subject: 'Welcome to PizzaApp',
  html: templates.welcomeEmail(user.name, `${process.env.CLIENT_URL}/dashboard`),
});

const sendPasswordResetEmail = (user, token) => sendEmail({
  to: user.email,
  subject: 'Reset your password',
  html: templates.passwordResetEmail(
    user.name,
    `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`,
  ),
});

const sendLowStockEmail = (ingredients) => sendEmail({
  to: process.env.ADMIN_EMAIL,
  subject: ingredients.length === 1
    ? `⚠️ Low Stock Alert: ${ingredients[0].name} is running low`
    : `⚠️ Low Stock Alert: ${ingredients.length} ingredients are running low`,
  html: templates.lowStockEmail(ingredients),
});

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLowStockEmail,
};
