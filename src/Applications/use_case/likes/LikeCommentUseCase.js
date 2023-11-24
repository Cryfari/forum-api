/**
 * class like comment use case
 */
class LikeCommentUseCase {
  /**
   * @param {object} param0
   */
  constructor({threadRepository, commentRepository, likeRepository}) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  /**
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} userId
   */
  async execute(threadId, commentId, userId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    const like = await this._likeRepository.verifyUserLike(commentId, userId);
    if (like) {
      await this._likeRepository.unLike(commentId, userId);
    } else {
      await this._likeRepository.like(commentId, userId);
    }
  }
}

module.exports = LikeCommentUseCase;
