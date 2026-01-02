const express = require('express');
const router = express.Router();
const mediaController = require('../../controllers/mediaController');
router.get('/media', mediaController.getMedia);

module.exports = router;
