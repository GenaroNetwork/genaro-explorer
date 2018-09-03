const { createLogger, format, transports } = require('winston')
const { colorize, combine, timestamp, simple } = format

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        simple()
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'all.log' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            timestamp(),
            simple()
        )
    }))
}
module.exports = logger
