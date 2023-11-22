const LoginUserUseCase = require(
    '../../../../Applications/use_case/authentications/LoginUserUseCase',
);
const RefreshAuthenticationUseCase = require(
    '../../../../Applications/use_case/' +
    'authentications/RefreshAuthenticationUseCase',
);
const LogoutUserUseCase = require(
    '../../../../Applications/use_case/authentications/LogoutUserUseCase',
);
const autoBind = require('auto-bind');

/**
 * authentications handler
 */
class AuthenticationsHandler {
  /**
   * constructor
   * @param {object} container
   */
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(LoginUserUseCase.name);
    const {accessToken, refreshToken} = await loginUserUseCase.execute(
        request.payload,
    );
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {object} request
   */
  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this._container
        .getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(
        request.payload,
    );

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  /**
   * @param {object} request
   */
  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this._container
        .getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
