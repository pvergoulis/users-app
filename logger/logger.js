// First example

// const winston = require('winston')

// const logger = winston.createLogger(
//   {
//       format: winston.format.json(),
//       transports: [
//         new winston.transports.Console()
//       ]
//   }
// )


//Second Example


// const {format,createLogger,transports } = require('winston')
// const { combine, timestamp, label, printf} = format
// const CATEGORY = "Products app logs"

// const customFormat = printf(({level, message, label, timestamp})=>{
//   return `${timestamp} [${label}: ${level}, ${message}]`
// })

// const logger = createLogger({
//   format: combine(
//     label({label:CATEGORY}),
//     timestamp(),
//     customFormat
//   ),
//   transports: [new transports.Console()]
// })



//Third Example

require('winston-daily-rotate-file')
require('winston-mongodb')
const {format,createLogger,transports } = require('winston')
const { combine, timestamp, label, printf} = format
const CATEGORY = "Products app logs"

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "14d"
})

const logger = createLogger({
  format: combine(
    label({label:"My Label for Products App"}),
    timestamp({format: "DD/MM/YYYY HH:mm:sss"}),
    format.json()
  ),
  transports: [
    new transports.Console(),
    fileRotateTransport,
    new transports.File(
      {
        filename:"logs/example.log"
      }
    ),
    new transports.File(
      {
        level: "warn",
        filename: 'logs/warn.log'
      }
    ),
    new transports.File(
      {
        level: "info",
        filename: 'logs/info.log'
      }
    ),
    new transports.MongoDB({
      level: "error",
      db: process.env.MONGODB_URI,
      collection: 'server_logs',
      format: format.combine(
          format.timestamp(),
          format.json()
      )
    })
  ]
  
})



module.exports = logger