const prisma = require('../config/database');
const { SCRAPE_LIMITS } = require('../config/settings');
const { scrapeQueue } = require('../services/queue');

async function submitJob(req, res, next) {
    try {
        const { urls } = req.body;

        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: 'urls array is required' });
        }

        if (urls.length > SCRAPE_LIMITS.MAX_URLS_PER_REQUEST) {
            return res.status(400).json({
                error: `Too many URLs. Maximum allowed is ${SCRAPE_LIMITS.MAX_URLS_PER_REQUEST} per request.`
            });
        }

        const jobPromises = urls.map(async (url) => {
            const job = await prisma.scrapeJob.create({
                data: {
                    url,
                    status: 'PENDING',
                    type: 'ALL'
                }
            });

            await scrapeQueue.add('scrape', {
                id: job.id,
                url: job.url,
                type: job.type
            });

            return job;
        });

        const createdJobs = await Promise.all(jobPromises);

        res.status(202).json({
            message: 'Scrape jobs submitted',
            jobs: createdJobs.map(j => ({ id: j.id, url: j.url, status: j.status }))
        });

    } catch (error) {
        next(error);
    }
}

async function getJobs(req, res, next) {
    try {
        const jobs = await prisma.scrapeJob.findMany({
            orderBy: { created_at: 'desc' },
            take: 50
        });
        res.json(jobs);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    submitJob,
    getJobs
};
