export function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode; // rewrite as subclass - http error
  return error;
}

//  внутрішній enum,
//  відповідь клієнту tohttp, tolog