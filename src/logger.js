import winston from "winston";
import config from "./config.js";
import { __dirname } from "./utils.js";

// Define the level system
const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const levelNames = [
  "fatal",
  "error",
  "warn",
  "info",
  "http",
  "debug",
];

const getLevel = (level) => {
  return levels[level] || 5; //default
};

// Crea loggers
const devLogger = winston.createLogger({
  level: "debug",
  levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.label({ label: "development" }),
        winston.format.printf(({ level, message, label }) => {
          return `${label} [${levelNames[getLevel(level)]}] ${message}`;
        })
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  level: "info",
  levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.printf(({ level, message, label }) => {
          return `${label} [${levelNames[getLevel(level)]}] ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: `${__dirname}/logs/errors.log`,
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.printf(({ level, message, label }) => {
          return `${label} [${levelNames[getLevel(level)]}] ${message}`;
        })
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger =
    config.MODE === "devel" ? devLogger : prodLogger;
  req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`);
  next();
};

export default addLogger;