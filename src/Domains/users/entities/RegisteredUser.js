/**
 * class for registered user
 */
class RegisteredUser {
  /**
   * constructor for new object
   * @param {object} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, username, fullname} = payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
  }

  /**
   * function for verify payload
   * @param {object} payload
   */
  _verifyPayload(payload) {
    const {id, username, fullname} = payload;
    if (!id || !username || !fullname) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' ||
        typeof username !== 'string' ||
        typeof fullname !== 'string') {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredUser;
