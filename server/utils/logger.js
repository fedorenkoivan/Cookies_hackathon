import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === "production";

const logDir = isProd
 ? path.join('/tmp', "logs")
 : path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (error) {
    console.error(`Cannot create log directory: ${error.message}`);
  }
}

const LOG_FILES = {
  INFO: path.join(logDir, "info.log"),
  DEBUG: path.join(logDir, "debug.log"),
  ERROR: path.join(logDir, "error.log"),
  WARNING: path.join(logDir, "warning.log"),
  USERS_ACTIVITY: path.join(logDir, "users_activity.log"),
  SYSTEM: path.join(logDir, "system.log"),
};

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
};

const COLORS = {
  DEBUG: "\x1b[36m", // Cyan
  INFO: "\x1b[32m", // Green
  WARNING: "\x1b[33m", // Yellow
  ERROR: "\x1b[31m", // Red
  RESET: "\x1b[0m", // reset all styles and colors
};

const DEFAULT_LOG_OPTIONS = {
  level: "INFO",
  logArgs: true,
  logResult: true,
  logTime: true,
  onlyErrors: false,
  category: null,
  funcName: "anonymous",
};

const formatLogMessage = (
  funcName,
  messageType,
  level,
  executionTime = null,
) => {
  const timePrefix = messageType === "ERROR" ? "after" : "in";
  const timeSuffix = executionTime ? ` ${timePrefix} ${executionTime}` : "";
  return `${level}: ${funcName} - ${messageType}${timeSuffix}`;
};

export const calculateExecutionTime = (startTime) => {
  return startTime ? `${(performance.now() - startTime).toFixed(2)}ms` : null;
};

const formatData = (data) => {
  const REDACT_KEYS = ["password", "refreshToken", "accessToken"];

  const replacer = (key, value) => {
    if (REDACT_KEYS.includes(key)) {
      return "[REDACTED]";
    }

    const maxImageCapacity = 500;
    const isImageData = (str) =>
      typeof str === "string" && str.startsWith("data:image/");

    if (typeof value === "string" && isImageData(value)) {
      const size = value.length;
      return size > maxImageCapacity
        ? `[IMAGE DATA: ${(size / 1024).toFixed(2)} KB]`
        : value;
    }

    return value;
  };

  try {
    if (data === null) return "null";
    if (["undefined", "function"].includes(typeof data)) return typeof data;
    if (data instanceof Date) return data.toISOString();
    if (typeof data === "object")
      return JSON.parse(JSON.stringify(data, replacer));
    return data;
  } catch {
    return String(data);
  }
};

export const writeLog = (level, message, data = null, category = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data,
    category,
  };

  if(isProd) {
    console[level.toLowerCase()] ? 
      console[level.toLowerCase()](JSON.stringify(logEntry)) : 
      console.log(JSON.stringify(logEntry));
    return;
  }

 try {
    const logString = JSON.stringify(logEntry) + "\n";
    const targetFile = LOG_FILES[level] || LOG_FILES.INFO;

    const appendToFile = (file) => {
      try {
        fs.appendFile(file, logString, (err) => {
          if (err) console.error(`Error writing to log file: ${err.message}`);
        });
      } catch (error) {
        console.error(`Failed to write to log file ${file}: ${error.message}`);
      }
    };

    appendToFile(targetFile);

    if (category && LOG_FILES[category]) {
      appendToFile(LOG_FILES[category]);
    }
  } catch (error) {
    console.error(`Logging error: ${error.message}`);
    console[level.toLowerCase()] ? 
      console[level.toLowerCase()](JSON.stringify(logEntry)) : 
      console.log(JSON.stringify(logEntry));
  }

  if ((process.env.NODE_ENV !== "production" && category == "SYSTEM") || level === "ERROR") {
    console.log(
      `${COLORS[level]}[${timestamp}] [${level}]${category ? `[${category}]` : ""}${COLORS.RESET} ${message}`,
      data ? `\n${JSON.stringify(formatData(data))}` : "",
    );
  }
};

export const log = (options = {}) => {
  const config = { ...DEFAULT_LOG_OPTIONS, ...options };

  return function (target) {
    const funcName = config.funcName;

    const wrapper = async function (...args) {
      if (
        !config.onlyErrors &&
        config.logArgs &&
        LOG_LEVELS[config.level] <= LOG_LEVELS.INFO
      ) {
        writeLog(
          config.level,
          formatLogMessage(funcName, "CALLED", config.level),
          { args: args.map((arg) => formatData(arg)) },
          config.category,
        );
      }

      const startTime = config.logTime ? performance.now() : null;

      try {
        const result = await target.apply(this, args);

        if (!config.onlyErrors && config.level !== "ERROR") {
          const executionTime = calculateExecutionTime(startTime);

          writeLog(
            config.level,
            formatLogMessage(
              funcName,
              "COMPLETED",
              config.level,
              executionTime,
            ),
            config.logResult ? { result: formatData(result) } : null,
            config.category,
          );
        }

        return result;
      } catch (error) {
        const executionTime = calculateExecutionTime(startTime);

        writeLog(
          "ERROR",
          formatLogMessage(funcName, "ERROR", config.level, executionTime),
          {
            error: {
              message: error.message,
              stack: error.stack,
            },
            args: config.logArgs ? args.map((arg) => formatData(arg)) : null,
          },
          config.category,
        );

        throw error;
      }
    };

    return wrapper;
  };
};
