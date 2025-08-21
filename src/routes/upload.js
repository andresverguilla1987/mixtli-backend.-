const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const { getPresignedUpload } = require('../utils/s3');

const prisma = new PrismaClient();
const router = express.Router();

router.post('/request', async (req, res) => {
  try {
    const { filename, contentType, sizeBytes } = req.body;
    if (!filename || !contentType) return res.status(400).json({ error: 'filename y contentType son requeridos' });
    const key = `${Date.now()}-${uuidv4()}-${filename}`;
    const uploadUrl = await getPresignedUpload(key, contentType);
    return res.json({ uploadUrl, fileKey: key });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generando URL de subida' });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { fileKey, filename, contentType, sizeBytes, passwordHash, expiresInDays = 7, transferId } = req.body;
    if (!fileKey || !filename || !contentType) return res.status(400).json({ error: 'fileKey, filename y contentType son requeridos' });
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const file = await prisma.file.create({
      data: {
        objectKey: fileKey,
        filename,
        contentType,
        sizeBytes: BigInt(sizeBytes || 0),
        token,
        passwordHash: passwordHash || null,
        expiresAt,
        transferId: transferId || null
      }
    });
    res.json({ downloadUrl: `/api/download/${file.token}`, token: file.token, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error confirmando subida' });
  }
});

module.exports = router;
