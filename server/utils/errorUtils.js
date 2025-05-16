import createError from '@fastify/error';

const FastifyErrors = {
  BAD_REQUEST: createError('FST_ERR_BAD_REQUEST', '%s', 400),
  UNAUTHORIZED: createError('FST_ERR_UNAUTHORIZED', '%s', 401),
  FORBIDDEN: createError('FST_ERR_FORBIDDEN', '%s', 403),
  NOT_FOUND: createError('FST_ERR_NOT_FOUND', '%s', 404),
  METHOD_NOT_ALLOWED: createError('FST_ERR_METHOD_NOT_ALLOWED', '%s', 405),
  CONFLICT: createError('FST_ERR_CONFLICT', '%s', 409),
  UNSUPPORTED_MEDIA_TYPE: createError('FST_ERR_UNSUPPORTED_MEDIA_TYPE', '%s', 415),
  UNPROCESSABLE_ENTITY: createError('FST_ERR_UNPROCESSABLE_ENTITY', '%s', 422),
  TOO_MANY_REQUESTS: createError('FST_ERR_TOO_MANY_REQUESTS', '%s', 429),
  
  INTERNAL_SERVER_ERROR: createError('FST_ERR_INTERNAL_SERVER_ERROR', '%s', 500),
  NOT_IMPLEMENTED: createError('FST_ERR_NOT_IMPLEMENTED', '%s', 501),
  BAD_GATEWAY: createError('FST_ERR_BAD_GATEWAY', '%s', 502),
  SERVICE_UNAVAILABLE: createError('FST_ERR_SERVICE_UNAVAILABLE', '%s', 503),
  GATEWAY_TIMEOUT: createError('FST_ERR_GATEWAY_TIMEOUT', '%s', 504)
};

const DefaultErrorMessages = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  CONFLICT: 'Conflict',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported Media Type',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  TOO_MANY_REQUESTS: 'Too Many Requests',
  
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  NOT_IMPLEMENTED: 'Not Implemented',
  BAD_GATEWAY: 'Bad Gateway',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
  GATEWAY_TIMEOUT: 'Gateway Timeout'
};

const ErrorType = Object.freeze(
  Object.fromEntries(
    Object.entries(FastifyErrors).map(([key, error]) => [key, error.statusCode])
  )
);
// custom error класи наслідники хттп еррро, ентітіт дазнт екзіст
// не робити наслідників
class HttpError extends Error {
  constructor(statusCode, message, metadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  getErrorType() {
    return Object.keys(ErrorType).find(
      key => ErrorType[key] === this.statusCode
    ) || 'UNKNOWN';
  }

  toHttp() {
    return {
      status: 'error',
      message: this.message,
      code: this.statusCode
    };
  }

  toLog() {
    return {
      type: this.getErrorType(),
      message: this.message,
      statusCode: this.statusCode,
      stack: this.stack,
      metadata: this.metadata,
      timestamp: new Date().toISOString()
    };
  }

  static createError(statusCode, message, metadata = {}) {
    const errorType = Object.keys(ErrorType).find(key => ErrorType[key] === statusCode);
    
    if (errorType) {
      const camelCaseMethod = errorType.toLowerCase()
        .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
      
      return httpErrorProxy[camelCaseMethod](message, metadata);
    }
    
    return new HttpError(statusCode, message, metadata);
  }

  static _enhanceError(fastifyError, metadata) {
    const httpError = new HttpError(
      fastifyError.statusCode, 
      fastifyError.message,
      metadata
    );
    
    Object.assign(httpError, {
      code: fastifyError.code,
      name: fastifyError.name
    });
    
    return httpError;
  }

  static fromDatabaseError(error) {
    if (error.name === 'DocumentNotFoundError' || error.message === 'User not found') {
      return httpErrorProxy.notFound('Resource not found');
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return httpErrorProxy.badRequest('Invalid ID format');
    }
    
    if (error.name === 'MongoError' || error.name === 'ValidationError') {
      return httpErrorProxy.badRequest(error.message);
    }
    
    return httpErrorProxy.internalServerError('Database error occurred');
  }
}

const httpErrorProxy = new Proxy(HttpError, {
  get(target, prop) {
    if (typeof target[prop] === 'function') {
      return target[prop];
    }
    
    if (typeof prop === 'string') {
      const upperProp = prop
        .replace(/([A-Z])/g, '_$1')
        .toUpperCase()
        .replace(/^_/, '');
      
      if (upperProp in FastifyErrors) {
        return (message, metadata = {}) => {
          const errorMessage = message || DefaultErrorMessages[upperProp] || upperProp.replace(/_/g, ' ');
          const fastifyError = new FastifyErrors[upperProp](errorMessage);
          return HttpError._enhanceError(fastifyError, metadata);
        };
      }
    }

    return target[prop];
  }
});

export { httpErrorProxy as HttpError, ErrorType, FastifyErrors };