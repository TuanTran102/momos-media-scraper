const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { logger } = require('../middlewares/logger');

puppeteer.use(StealthPlugin());

async function scrapeUrl(url, type = 'ALL') {
    logger.info(`Starting scrape for ${url} [Type: ${type}]`);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await autoScroll(page);

        const media = await page.evaluate((type) => {
            const results = [];

            const getSrc = (el) => el.src || el.getAttribute('src') || el.getAttribute('data-src');

            if (type === 'ALL' || type === 'IMAGE') {
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    const src = getSrc(img);
                    if (src && src.startsWith('http')) {
                        results.push({ url: src, type: 'IMAGE' });
                    }
                });
            }

            if (type === 'ALL' || type === 'VIDEO') {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    const src = getSrc(video);
                    if (src && src.startsWith('http')) {
                        results.push({ url: src, type: 'VIDEO' });
                    } else {
                        const sources = video.querySelectorAll('source');
                        sources.forEach(source => {
                            const sSrc = getSrc(source);
                            if (sSrc && sSrc.startsWith('http')) {
                                results.push({ url: sSrc, type: 'VIDEO' });
                            }
                        });
                    }
                });
            }

            const uniqueMedia = [];
            const seen = new Set();
            results.forEach(m => {
                if (!seen.has(m.url)) {
                    seen.add(m.url);
                    uniqueMedia.push(m);
                }
            });

            return uniqueMedia;

        }, type);

        logger.info(`Scraped ${media.length} items from ${url}`);
        return media;

    } catch (error) {
        logger.error(`Error scraping ${url}: ${error.message}`);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = { scrapeUrl };
