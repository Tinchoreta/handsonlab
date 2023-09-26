import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import __dirname from '../utils.js';
import { generateResetToken } from '../utils/passwordReset.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_USER_APP,
        pass: config.GMAIL_PASS_APP
    }
});

// Función para enviar correos electrónicos personalizados
const sendMail = async (toEmail, subject, text, html, attachments) => {
    try {
        // Definir el contenido del correo electrónico
        const mailOptions = {
            from: config.GMAIL_USER_APP,
            to: toEmail,
            subject: subject,
            text: text,
            html: html,
            attachments: attachments,
        };

        // Enviar el correo electrónico
        const info = await transport.sendMail(mailOptions);

        console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
};

// Función para enviar correo de restablecimiento de contraseña

export const sendPasswordResetEmail = async (toEmail) => {
    const subject = 'Restablecimiento de contraseña';
    const text = 'Has solicitado restablecer tu contraseña en nuestro sitio web. Si no solicitaste esto, ignora este correo.';

    // Genera el token JWT
    const resetToken = generateResetToken(toEmail);

    // Construye el enlace de restablecimiento con el token JWT
    const resetLink = `https://localhost:8080/mail/reset-password?token=${resetToken}`;

    const html = `
        <p>Has solicitado restablecer tu contraseña en nuestro sitio web.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Si no solicitaste esto, ignora este correo.</p>
    `;
}
    const mailOptions = {
        to: toEmail,
        subject: subject,
        text: text,
        html: html,
    };

export { sendMail, sendPasswordResetEmail };