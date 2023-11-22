/**
 * abstract class for comment repository
 */
class RepliesRepository {
  /**
   * @param {object} payload
   * @param {string} commentId
   * @param {string} owner
   */
  async addReply(payload, commentId, owner) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} repliesId
   */
  async deleteReply(repliesId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {String} repliesId
   */
  async verifyAvailableReplies(repliesId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} repliesId
   * @param {string} owner
   */
  async verifyOwnerReplies(repliesId, owner) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {String} commentId
   */
  async getAllRepliesOfComment(commentId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = RepliesRepository;
