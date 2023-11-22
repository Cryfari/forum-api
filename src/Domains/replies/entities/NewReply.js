/**
 * class for new Replies
 */
class NewReplies {
  /**
   * constructor for new object
   * @param {object} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
  }

  /**
   * function for verify payload
   * @param {object} payload
   */
  _verifyPayload(payload) {
    const {content} = payload;

    if (!content) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReplies;
