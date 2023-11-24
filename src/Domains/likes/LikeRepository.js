/**
 * abstract class for like repo
 */
class LikeRepository {
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async like(commentId, owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async unLike(commentId, owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async verifyUserLike(commentId, owner) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * @param {string} commentId
   */
  async getLikeCountOfComment(commentId) {
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeRepository;
