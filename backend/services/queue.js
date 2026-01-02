const { Queue, Worker } = require('bullmq');
const { scrapeUrl } = require('./scraper');
const prisma = require('../config/database');
const { logger } = require('../middlewares/logger');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const connection = {
    host: REDIS_HOST,
    port: REDIS_PORT,
};

const scrapeQueue = new Queue('scrape-queue', {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: {
            count: 100
        }
    }
});

const CONCURRENCY = parseInt(process.env.SCRAPE_CONCURRENCY || '2', 10);

const worker = new Worker('scrape-queue', async (job) => {
    const { id, url, type } = job.data;
    logger.info(`Processing job ${job.id} for URL: ${url}`);

    try {
        await prisma.scrapeJob.update({
            where: { id },
            data: { status: 'PROCESSING' },
        });

        const media = await scrapeUrl(url, type);

        if (media.length > 0) {
            await prisma.mediaItem.createMany({
                data: media.map(m => ({
                    url: m.url,
                    type: m.type,
                    source_url: url,
                })),
                skipDuplicates: true,
            });
        }

        await prisma.scrapeJob.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });

        logger.info(`Job ${job.id} completed. Found ${media.length} items.`);
        return media;

    } catch (error) {
        logger.error(`Job ${job.id} failed: ${error.message}`);
        await prisma.scrapeJob.update({
            where: { id },
            data: { status: 'FAILED', error: error.message },
        });
        throw error;
    }
}, {
    connection,
    concurrency: CONCURRENCY
});

worker.on('failed', (job, err) => {
    logger.error(`Job ${job.id} failed with error ${err.message}`);
});

module.exports = {
    scrapeQueue,
    worker,
};
