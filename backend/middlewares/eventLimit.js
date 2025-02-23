const { Event } = require('../models/Event');
const dotenv = require('dotenv');

dotenv.config();

const DAILY_EVENT_LIMIT = parseInt(process.env.DAILY_EVENT_LIMIT, 10) || 5; // Лимит из .env

/**
 * Middleware для проверки лимита созданных мероприятий за последние 24 часа
 */
const checkEventLimit = async (req, res, next) => {
    const { createdBy } = req.body; // ID пользователя, создающего мероприятие

    try {
        // Находим все мероприятия, созданные пользователем за последние 24 часа
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const eventsCount = await Event.count({
            where: {
                createdBy,
                createdAt: {
                    [Op.gte]: twentyFourHoursAgo, // События, созданные за последние 24 часа
                },
            },
        });

        // Если лимит превышен, возвращаем ошибку
        if (eventsCount >= DAILY_EVENT_LIMIT) {
            return res.status(429).json({
                error: `Превышен лимит создания мероприятий. Лимит: ${DAILY_EVENT_LIMIT} в день.`,
            });
        }

        // Если лимит не превышен, переходим к следующему middleware
        next();
    } catch (error) {
        console.error('Ошибка при проверке лимита мероприятий:', error);
        res.status(500).json({ error: 'Ошибка при проверке лимита мероприятий' });
    }
};

module.exports = checkEventLimit;
