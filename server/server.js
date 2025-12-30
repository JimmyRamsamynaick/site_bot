require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Définition de la racine du projet
// SUR VOTRE VPS, REMPLACEZ LA LIGNE CI-DESSOUS PAR : const projectRoot = '/root/site_bot';
const projectRoot = process.env.PROJECT_ROOT || path.resolve(__dirname, '..');

console.log('--- SERVER START ---');
console.log('Project Root:', projectRoot);
console.log('Index HTML path:', path.join(projectRoot, 'index.html'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les dossiers statiques explicitement
app.use('/css', express.static(path.join(projectRoot, 'css')));
app.use('/js', express.static(path.join(projectRoot, 'js')));
app.use('/yako', express.static(path.join(projectRoot, 'yako')));
app.use('/visiongiveaway', express.static(path.join(projectRoot, 'visiongiveaway')));
app.use('/lux-compta', express.static(path.join(projectRoot, 'lux-compta')));

// Route racine explicite
app.get('/', (req, res) => {
    const indexPath = path.join(projectRoot, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('ERREUR: Impossible d\'envoyer index.html', err);
            res.status(500).send('Erreur serveur: index.html introuvable.');
        }
    });
});

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route de contact
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, website_url } = req.body;

    // --- SÉCURITÉ HONEYPOT ---
    // Si le champ caché 'website_url' est rempli, c'est un robot.
    // On renvoie un succès pour le tromper, mais on n'envoie PAS l'email.
    if (website_url) {
        console.log(`Bot bloqué ! Honeypot rempli par : ${email}`);
        return res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès !' });
    }
    // -------------------------

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    const mailOptions = {
        from: `"${name}" <${email}>`, // L'expéditeur affiché
        to: process.env.EMAIL_USER, // Votre adresse email qui reçoit
        subject: `[Contact Site Bot] ${subject}`,
        text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`,
        html: `
            <h3>Nouveau message de contact</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            <br>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès');
        res.status(200).json({ success: true, message: 'Votre message a été envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
