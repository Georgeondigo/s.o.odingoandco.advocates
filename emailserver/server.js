const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Path to the company logo
const logoPath = path.join(__dirname, 'public', 'logolaw3.png'); // Adjust the path as needed

// Endpoint to handle contact form email sending
app.post('/send-email', (req, res) => {
    const { name, phone, email, message } = req.body;

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'fxwesty@gmail.com',
        subject: 'New Contact Form Submission',
        html: `<p>Name: ${name}</p>
               <p>Phone: ${phone}</p>
               <p>Email: ${email}</p>
               <p>Message: ${message}</p>
               <img src="cid:logo" alt="Company Logo" />`,
        attachments: [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo' // Reference this CID in the email body
            }
        ]
    };

    // Auto-reply email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank You for Reaching Out!',
        html: `<p>Hi ${name},</p>
               <p>Thank you for your message. We have received your contact information and will get back to you shortly.</p>
               <p>Your Message:</p>
               <p>${message}</p>
               <p>Best regards,</p>
               <p>Samuel Okumu Odingo & Co Advocates Team</p>
               <img src="cid:logo" alt="Company Logo" />`,
        attachments: [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo' // Reference this CID in the email body
            }
        ]
    };

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Nodemailer error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Admin email sent:', info.response);

        // Send auto-reply email
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Nodemailer auto-reply error:', error);
                return res.status(500).json({ error: 'Failed to send auto-reply' });
            }
            console.log('Auto-reply email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully!' });
        });
    });
});

// Endpoint to handle appointment form email sending
app.post('/send-appointment', (req, res) => {
    const { name, email, phone, service, preferred_date, message } = req.body;

    // Email to admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'fxwesty@gmail.com',
        subject: 'New Appointment Request',
        html: `<p>Name: ${name}</p>
               <p>Phone: ${phone}</p>
               <p>Email: ${email}</p>
               <p>Service: ${service}</p>
               <p>Preferred Date: ${preferred_date}</p>
               <p>Message: ${message}</p>
               <img src="cid:logo" alt="Company Logo" />`,
        attachments: [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo' // Reference this CID in the email body
            }
        ]
    };

    // Auto-reply email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Appointment Request Received!',
        html: `<p>Hi ${name},</p>
               <p>Thank you for scheduling an appointment with us. We have received your request and will get back to you soon to confirm the details.</p>
               <p>Service Requested: ${service}</p>
               <p>Preferred Date: ${preferred_date}</p>
               <p>Additional Information:</p>
               <p>${message}</p>
               <p>Best regards,</p>
               <p>Samuel Okumu Odingo & Co Advocates Team</p>
               <img src="cid:logo" alt="Company Logo" />`,
        attachments: [
            {
                filename: 'logo.png',
                path: logoPath,
                cid: 'logo' // Reference this CID in the email body
            }
        ]
    };

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Nodemailer error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Admin email sent:', info.response);

        // Send auto-reply email
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.error('Nodemailer auto-reply error:', error);
                return res.status(500).json({ error: 'Failed to send auto-reply' });
            }
            console.log('Auto-reply email sent:', info.response);
            res.status(200).json({ message: 'Appointment request sent successfully!' });
        });
    });
});

// Status route
app.get('/', (req, res) => {
    res.send('<h1>This is my email server</h1>');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
