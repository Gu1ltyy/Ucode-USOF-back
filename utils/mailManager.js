const nodemailer = require('nodemailer');

class MailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'email@gmail.com', //TYPE YOUR REAL EMAIL AND PASSWORD before starting server
                pass: 'pass'
            }
        });
    }

    async sendActivationMail(to, link) {
        let mailOptions = {
            from: 'email@gmail.com', //TYPE YOUR REAL EMAIL before starting server
            to: to,
            subject: 'Activate your account in USOF',
            text: `Hello, you provided this email address when you registered with USOF. Please take a moment to confirm your account by clicking on the link: ${link}`
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject('An error occurred.');
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve('Activation email sent.');
                }
            });
        });
    }

    async sendPasswordResetLink(to, link) {
        let mailOptions = {
            from: 'email@gmail.com', //TYPE YOUR REAL EMAIL before starting server
            to: to,
            subject: 'Password Reminder in USOF',
            text: `Follow this link to reset your password: ${link} \nIf you have not requested password recovery, simply ignore this message.`
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject('An error occurred.');
                } else {
                    console.log('Email sent: ' + info.response);
                    resolve('Password email sent.');
                }
            });
        });
    }
}

module.exports = new MailManager();
