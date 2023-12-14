const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });

// Create Reservation Schema and Model
const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    fromTime: String,
    untilTime: String,
    date: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// Add Reservation Route
app.post('/api/reservations', async (req, res) => {
    const { name, email, fromTime, untilTime, date } = req.body;

    console.log('Received reservation data:', { name, email, fromTime, untilTime, date });

    try {
        const reservation = new Reservation({ name, email, fromTime, untilTime, date });
        await reservation.save();

        // Send confirmation email
        await sendConfirmationEmail(name, email);

        res.status(201).json(reservation);
    } catch (error) {
        console.error('Error saving reservation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to send confirmation email
async function sendConfirmationEmail(name, email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL, // email address
            pass: process.env.NODEMAILER_PASSWORD // password
        }
    });

    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: 'Reservation Confirmation',
        text: `Dear ${name},\n\nThank you for making a reservation for the Somerset Clubhouse. Your reservation has been confirmed.\n\nBest regards,\nThe Somerset Management`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

// Get Reservations Route
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});