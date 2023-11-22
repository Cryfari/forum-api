/**
 * class for login user
 */
class UserLogin {
  /**
   * constructor for new object
   * @param {object} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }
  /**
   * function for verify payload
   * @param {object} payload
   */
  _verifyPayload(payload) {
    const {username, password} = payload;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserLogin;
