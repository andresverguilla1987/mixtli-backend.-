require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { deleteExpired } = require('./cleanup_core');

(async () => {
  const prisma = new PrismaClient();
  await deleteExpired(prisma);
  process.exit(0);
})();
