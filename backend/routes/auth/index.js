const express = require('express');
const router = express.Router();
const scrapeController = require('../../controllers/scrapeController');

router.post('/scrape', scrapeController.submitJob);
router.get('/jobs', scrapeController.getJobs);

module.exports = router;
