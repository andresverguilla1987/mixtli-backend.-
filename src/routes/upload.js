const express = require('express');
const router = express.Router();

router.post('/request', (req, res) => {
  res.json({ ok: true, message: 'Aquí irá la URL prefirmada (R2/S3) en la versión PRO' });
});

module.exports = router;
