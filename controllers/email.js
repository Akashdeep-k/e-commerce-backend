const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

const sendPasswordResetEmail = (email, id, token) => {
    transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Reset password link",
        html: `
            <p>Click on the link to reset your password. The link is valid only for 10 minutes.</p>
            <a href="http://localhost:3000/api/user/${id}/${token}">Click here</a>`
    }, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Email sent with info => ", info);
        }
    });
}

module.exports = sendPasswordResetEmail;