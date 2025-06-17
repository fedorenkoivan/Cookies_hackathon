import nodemailer from 'nodemailer';

const sendEmailOriginal = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Cookies Reset Password <noreply@cookiesquest.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  return await transporter.sendMail(mailOptions);
};

const emailServiceHandler = {
  async apply(target, thisArg, args) {
    const [options] = args;
    
    if (!options.email || !options.subject) {
      console.error('Email sending failed: Missing required fields');
      throw new Error('Email must have recipient and subject');
    }
    
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = new Error("Too many attempts to send email");
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        const result = await target.apply(thisArg, args);
        return result;
      } catch (error) {
        lastError.message = error.message;
        console.error(`Email sending failed (Attempt ${attempts}/${maxAttempts}):`, error.message);
        
        if (attempts < maxAttempts) {
          const delay = 1000 * Math.pow(2, attempts - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`Failed to send email after ${maxAttempts} attempts`);
    throw lastError;
  }
};

export const sendEmail = new Proxy(sendEmailOriginal, emailServiceHandler);