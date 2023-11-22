/**
 * abstract class for comment repository
 */
class CommentRepository {
  /**
   * abstract function for add comment
   * @param {object} payload
   * @param {string} threadId
   * @param {string} owner
   */
  async addComment(payload, threadId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for delete comment
   * @param {string} commentId
   */
  async deleteComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for verify Available Comment
   * @param {String} commentId
   */
  async verifyAvailableComment(commentId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async verifyOwnerComment(commentId, owner) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for get all Comment of thread
   * @param {String} threadId
   */
  async getAllCommentsOfThread(threadId) {
    throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentRepository;
