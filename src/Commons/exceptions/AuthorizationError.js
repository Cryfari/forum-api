const ClientError = require('./ClientError');
/**
 * class for object authorization object
 */
class AuthorizationError extends ClientError {
  /**
   * constructor for new object
   * @param {string} message
   */
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
