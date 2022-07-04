const errorContent = {
  badRequest: {
    statusCode: 400,
    message: 'Переданы некорректные данные',
  },
  unauthorizedLogin: {
    statusCode: 401,
    message: 'Неверный логин или пароль',
  },
  unauthorizedAuth: {
    statusCode: 401,
    message: 'Необходима авторизация',
  },
  forbidden: {
    statusCode: 403,
    message:
      'Недостаточно прав для совершения операции. Отказано в доступе',
  },
  userNotFound: {
    statusCode: 404,
    message: 'Запрашиваемый пользователь не найден',
  },
  cardNotFound: {
    statusCode: 404,
    message: 'Запрашиваемая карточка не найдена',
  },
  pageNotFound: {
    statusCode: 404,
    message: 'Error 404. Страница не найдена',
  },
  conflict: {
    statusCode: 409,
    message: 'Пользователь с таким почтовым адресом уже существует',
  },
};

module.exports = errorContent;
