import createError from "@fastify/error";

const ERROR_TYPES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const FastifyErrors = Object.fromEntries(
  Object.entries(ERROR_TYPES).map(([key, code]) => [
    key,
    createError(`FST_ERR_${key}`, "%s", code),
  ]),
);

const DefaultErrorMessages = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  CONFLICT: "Conflict",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  TOO_MANY_REQUESTS: "Too Many Requests",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  NOT_IMPLEMENTED: "Not Implemented",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  GATEWAY_TIMEOUT: "Gateway Timeout",
};

class HttpError extends Error {
  constructor(statusCode, message, metadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrorType() {
    return (
      Object.keys(ERROR_TYPES).find(
        (key) => ERROR_TYPES[key] === this.statusCode,
      ) || "UNKNOWN"
    );
  }

  toHttp() {
    return {
      status: "error",
      message: this.message,
      code: this.statusCode,
    };
  }

  toLog() {
    return {
      type: this.getErrorType(),
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
      metadata: this.metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

function createHttpError(type, message, metadata = {}) {
  if (!ERROR_TYPES[type]) {
    type = "INTERNAL_SERVER_ERROR";
  }

  const errorMessage =
    message || DefaultErrorMessages[type] || type.replace(/_/g, " ");
  const fastifyError = new FastifyErrors[type](errorMessage);

  const error = new HttpError(
    fastifyError.statusCode,
    fastifyError.message,
    metadata,
  );

  Object.assign(error, {
    code: fastifyError.code,
    name: fastifyError.name,
  });

  return error;
}

function fromDatabaseError(error) {
  if (
    error.name === "DocumentNotFoundError" ||
    error.message === "User not found"
  ) {
    return createHttpError("NOT_FOUND", "Resource not found");
  }

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return createHttpError("BAD_REQUEST", "Invalid ID format");
  }

  if (error.name === "MongoError" || error.name === "ValidationError") {
    return createHttpError("BAD_REQUEST", error.message);
  }

  return createHttpError("INTERNAL_SERVER_ERROR", "Database error occurred");
}

const errorFactory = Object.assign(createHttpError, {
  fromDatabaseError,

  createFromStatusCode(statusCode, message, metadata = {}) {
    const errorType = Object.keys(ERROR_TYPES).find(
      (key) => ERROR_TYPES[key] === statusCode,
    );
    return errorType
      ? createHttpError(errorType, message, metadata)
      : new HttpError(statusCode, message || "Unknown Error", metadata);
  },
});

export {
  errorFactory as HttpError,
  ERROR_TYPES as ErrorType,
  FastifyErrors,
  createHttpError as createError,
};
