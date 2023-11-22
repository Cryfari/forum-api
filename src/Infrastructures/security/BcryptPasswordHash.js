const EncryptionHelper = require('../../Applications/security/PasswordHash');
const AuthenticationError = require(
    '../../Commons/exceptions/AuthenticationError',
);

/**
 * class bcrypt
 */
class BcryptPasswordHash extends EncryptionHelper {
  /**
   * @param {object} bcrypt
   * @param {integer} saltRound
   */
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  /**
   * @param {string} password
   */
  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   */
  async comparePassword(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah');
    }
  }
}

module.exports = BcryptPasswordHash;
