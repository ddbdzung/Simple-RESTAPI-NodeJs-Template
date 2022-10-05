import {
  format as _format,
  createLogger,
  transports as _transports,
} from 'winston'

const enumerateErrorFormat = _format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: _format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development' ? _format.colorize() : _format.uncolorize(),
    _format.splat(),
    _format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new _transports.Console({
      stderrLevels: ['error'],
    }),
  ],
})

export default logger
