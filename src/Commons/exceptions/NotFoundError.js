const ClientError = require('./ClientError');
/**
 * class for object Client error
 */
class NotFoundError extends ClientError {
  /**
   * constructor for new object
   * @param {string} message
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
