const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d88e8313383f35",
      pass: "c8dd65fd7e1ca8"
    }
  });

const formatDateTime = (isoString) => {
    const dateObj = new Date(isoString);

    const options = { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
    };

    return dateObj.toLocaleDateString('fr-FR', options);
};

const sendConfirmationEmail = async (rdv) => {
    try {
        const formattedDate = formatDateTime(rdv.date_rdv);
        const clientEmail = rdv.client.mail || "no-email@example.com";
        const prestationName = rdv.prestation.name || "Prestation non spécifiée";

        const info = await transporter.sendMail({
            from: '"GaragePro" <no-reply@garagepro.com>',
            to: clientEmail,
            subject: "Confirmation de votre rendez-vous",
            html: `<p>Bonjour,</p>
                   <p>Votre rendez-vous pour la prestation "<strong>${prestationName}</strong>" 
                   est confirmé pour le <strong>${formattedDate}</strong>.</p>
                   <p>Merci de votre confiance !</p>`
        });

        console.log("E-mail envoyé: %s", info.messageId);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
    }
};

module.exports = { sendConfirmationEmail };
