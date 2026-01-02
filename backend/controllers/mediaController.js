const prisma = require('../config/database');
const { MEDIA_LIMITS } = require('../config/settings');

async function getMedia(req, res, next) {
    try {
        let { type, search, page = 1, limit = 20 } = req.query;

        limit = Math.min(parseInt(limit), MEDIA_LIMITS.MAX_ITEMS_PER_PAGE);

        const skip = (parseInt(page) - 1) * limit;
        const take = limit;

        const where = {};
        if (type) {
            where.type = type;
        }
        if (search) {
            where.OR = [
                { url: { contains: search } },
                { source_url: { contains: search } }
            ];
        }

        const [items, total] = await prisma.$transaction([
            prisma.mediaItem.findMany({
                where,
                skip,
                take,
                orderBy: { created_at: 'desc' },
            }),
            prisma.mediaItem.count({ where })
        ]);

        res.json({
            data: items,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMedia
};
