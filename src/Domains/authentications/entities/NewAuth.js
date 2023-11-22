/**
 * class for entities auth
 */
class NewAuth {
  /**
   * constructor for new object NewAuth
   * @param {object} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  /**
   * function for verify payload
   * @param {object} payload
   */
  _verifyPayload(payload) {
    const {accessToken, refreshToken} = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewAuth;
