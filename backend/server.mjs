import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
// Inicializa Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

// Nuevo: Middleware para verificar tokens de App Check
// app.use(async (req, res, next) => {
//     const appCheckToken = req.header('X-Firebase-AppCheck');
//     if (!appCheckToken) {
//         return res.status(401).json({ message: 'No App Check token provided' });
//     }

//     try {
//         await admin.appCheck().verifyToken(appCheckToken);
//         next();
//     } catch (error) {
//         console.error('Error verifying App Check token:', error);
//         return res.status(401).json({ message: 'Invalid App Check token' });
//     }
// });

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
// Endpoint para incrementar intentos fallidos
app.post('/increment-failed-login', async (req, res) => {
    const { email } = req.body;
    // Validar el formato del email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
    }
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 30 * 60 * 1000; // 30 minutos

    try {
        const userDocRef = db.collection('usuarios').doc(email);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            let attempts = (userData.failedAttempts || 0) + 1;
            let lockedUntil = null;

            if (attempts >= MAX_LOGIN_ATTEMPTS) {
                attempts = 0;
                lockedUntil = admin.firestore.Timestamp.fromDate(new Date(Date.now() + LOCK_TIME));
            }

            await userDocRef.update({
                failedAttempts: attempts,
                lockedUntil: lockedUntil
            });

            res.json({ message: lockedUntil ? 'Cuenta bloqueada temporalmente' : 'Intento de inicio de sesión fallido incrementado' });
        } else {
            console.warn(`Documento de usuario para ${email} no existe.`);
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error incrementando intentos fallidos:', error);
        res.status(500).json({ message: 'Error incrementando intentos fallidos' });
    }
});

// Endpoint para resetear intentos fallidos
app.post('/reset-failed-login', async (req, res) => {
    const { email } = req.body;
    // Validar el formato del email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
    }
    try {
        const userDocRef = db.collection('usuarios').doc(email);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            await userDocRef.update({
                failedAttempts: 0,
                lockedUntil: null
            });

            res.json({ message: 'Intentos fallidos reseteados' });
        } else {
            console.warn(`Documento de usuario para ${email} no existe.`);
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error reseteando intentos fallidos:', error);
        res.status(500).json({ message: 'Error reseteando intentos fallidos' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
