const ClientError = require('./ClientError');
/**
 * class for object authentication object
 */
class AuthenticationError extends ClientError {
  /**
   * constructor for new object
   * @param {string} message
   */
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
