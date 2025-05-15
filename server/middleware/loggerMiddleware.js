import { writeLog, calculateExecutionTime } from "../utils/logger.js";

export const logRoute = (activityType) => {
  return async (request, reply) => {
    const startTime = performance.now();
    const route = request.routerPath || request.url;
    const requestId = Math.random().toString(36).substring(2, 15);
    const userId =
      request.user?.id || request.body?.email || request.ip || "unknown";

    writeLog(
      "INFO",
      `${activityType.toUpperCase()}: ${route} - STARTED`,
      {
        userId,
        method: request.method,
        path: route,
        ip: request.ip,
        userAgent: request.headers["user-agent"],
        requestId: requestId,
      },
      "USERS_ACTIVITY",
    );

    const originalSend = reply.send;
    reply.send = function (payload) {
      const executionTime = calculateExecutionTime(startTime);

      const parsePayload = (payload) => {
        return typeof payload === "string" ? JSON.parse(payload) : payload;
      };

      try {
        const response = parsePayload(payload);
        const isSuccess = response?.status === "success";
        const logLevel = isSuccess ? "INFO" : "ERROR";
        const status = isSuccess ? "SUCCESS" : "FAILED";

        writeLog(
          logLevel,
          `${activityType.toUpperCase()}: ${route} - ${status} in ${executionTime}`,
          {
            userId,
            statusCode: reply.statusCode,
            responseStatus: response?.status,
            message: response?.message,
            duration: executionTime,
            requestId: requestId,
          },
          "USERS_ACTIVITY",
        );
      } catch (error) {
        writeLog(
          "ERROR",
          `Error logging response: ${error.message}`,
          null,
          "USERS_ACTIVITY",
        );
      }

      return originalSend.call(this, payload);
    };
  };
};
