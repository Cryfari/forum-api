const AuthenticationTokenManager = require(
    '../../Applications/security/AuthenticationTokenManager',
);
const InvariantError = require('../../Commons/exceptions/InvariantError');

/**
 * class implement from authentication token manager
 */
class JwtTokenManager extends AuthenticationTokenManager {
  /**
   * @param {object} jwt
   */
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  /**
   * @param {string} payload
   */
  async createAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }
  /**
   * @param {string} payload
   */
  async createRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }
  /**
  * @param {string} token
  */
  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }
  /**
  * @param {string} token
  */
  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;
