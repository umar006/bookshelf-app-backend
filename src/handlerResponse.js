const responseSuccess = (h, statusCode, messageBody, dataBody) => {
  if (!messageBody) {
    const response = h.response({
      status: 'success',
      data: dataBody,
    });

    response.code(statusCode);
    return response;
  }

  if (!dataBody) {
    const response = h.response({
      status: 'success',
      message: messageBody,
    });

    response.code(statusCode);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: messageBody,
    data: dataBody,
  });

  response.code(statusCode);
  return response;
};

const responseFail = (h, statusCode, messageBody) => {
  const response = h.response({
    status: 'fail',
    message: messageBody,
  });

  response.code(statusCode);
  return response;
};

const responseError = (h, statusCode, messageBody) => {
  const response = h.response({
    status: 'error',
    message: messageBody,
  });

  response.code(statusCode);
  return response;
};

export {responseSuccess, responseFail, responseError};
