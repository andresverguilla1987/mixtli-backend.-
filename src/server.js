require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');
const sendRoutes = require('./routes/send');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { deleteExpired } = require('./worker/cleanup_core');

const prisma = new PrismaClient();
const app = express();

app.use(helmet());
app.use(express.json({ limit: '20mb' }));
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

app.get('/', (req, res) => res.send('API Mixtli PRO funcionando 🚀'));

app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/send', sendRoutes);

cron.schedule('0 3 * * *', async () => {
  try {
    console.log('[CRON] Limpiando expirados...');
    await deleteExpired(prisma);
    console.log('[CRON] Limpieza completa');
  } catch (e) {
    console.error('Error en cleanup cron', e);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
