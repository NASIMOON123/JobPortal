
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendAcceptanceEmail = async (recipientEmail, recipientName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: 'Application Accepted',
      text: `Dear ${recipientName},\n\nCongratulations! Your application has been accepted.\n\nBest regards,\nCompany Name`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Acceptance email sent successfully.');
  } catch (error) {
    console.error('Error sending acceptance email:', error);
  }
};

export default sendAcceptanceEmail;
