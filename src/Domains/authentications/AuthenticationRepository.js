/**
 * abstract class for authentication repository
 */
class AuthenticationRepository {
  /**
   * abstract method for add token
   * @param {string} token
   */
  async addToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract method for check availability token
   * @param {string} token
   */
  async checkAvailabilityToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract method for delete token
   * @param {string} token
   */
  async deleteToken(token) {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthenticationRepository;
