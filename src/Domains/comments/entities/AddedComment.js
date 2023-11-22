/**
 * class for added comments
 */
class AddedComment {
  /**
   * constructor for nwe object
   * @param {object} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, content, owner} = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  /**
   * function for verify payload
   * @param {object} payload
   */
  _verifyPayload(payload) {
    const {id, content, owner} = payload;

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' ||
        typeof content !== 'string' ||
        typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
