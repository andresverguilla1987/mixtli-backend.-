const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { to, link } = req.body;
    if (!to || !link) return res.status(400).json({ error: 'to y link requeridos' });
    if (!process.env.RESEND_API_KEY) return res.status(400).json({ error: 'Configura RESEND_API_KEY' });
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'no-reply@mixtli.app',
      to,
      subject: 'Has recibido un archivo en Mixtli',
      html: `<p>Hola, tienes un archivo listo para descargar:</p><p><a href="${link}">${link}</a></p>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error enviando email' });
  }
});

module.exports = router;
