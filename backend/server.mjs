import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint para verificar reCAPTCHA
app.post('/verify-recaptcha', async (req, res) => {
    const { token } = req.body;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    // console.log('reCAPTCHA verification response:', data);
    res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
