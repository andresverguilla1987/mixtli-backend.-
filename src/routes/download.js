const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { getPresignedDownload } = require('../utils/s3');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const file = await prisma.file.findUnique({ where: { token } });
    if (!file) return res.status(404).json({ error: 'No encontrado' });
    if (new Date(file.expiresAt) < new Date()) return res.status(410).json({ error: 'Expirado' });
    const url = await getPresignedDownload(file.objectKey);
    await prisma.file.update({ where: { token }, data: { downloadCount: { increment: 1 } } });
    res.json({ downloadUrl: url, filename: file.filename, contentType: file.contentType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando link de descarga' });
  }
});

module.exports = router;
