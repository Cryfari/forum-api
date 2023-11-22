const ClientError = require('./ClientError');
/**
 * class for object Client error
 */
class InvariantError extends ClientError {
  /**
   * constructor for new object
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
