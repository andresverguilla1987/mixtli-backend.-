const { PrismaClient } = require('@prisma/client');
const { deleteObject } = require('../utils/s3');

async function deleteExpired(prismaExternal) {
  const prisma = prismaExternal || new PrismaClient();
  const now = new Date();
  const expired = await prisma.file.findMany({ where: { expiresAt: { lt: now } } });
  for (const f of expired) {
    try {
      await deleteObject(f.objectKey);
      await prisma.file.delete({ where: { id: f.id } });
      console.log('[CLEANUP] Eliminado', f.objectKey);
    } catch (e) {
      console.error('[CLEANUP] Error eliminando', f.objectKey, e.message);
    }
  }
}

module.exports = { deleteExpired };
