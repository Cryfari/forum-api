/**
 * class for Delete comment
 */
class DeleteCommentUseCase {
  /**
   * @param {object} param0
   */
  constructor({commentRepository}) {
    this._commentRepository = commentRepository;
  }
  /**
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} owner
   */
  async execute(threadId, commentId, owner) {
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyOwnerComment(commentId, owner);
    await this._commentRepository.deleteComment(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
