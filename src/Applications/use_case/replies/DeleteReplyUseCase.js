/**
 * class for Delete comment
 */
class DeleteReplyUseCase {
  /**
   * @param {object} param0
   */
  constructor({repliesRepository, commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._threadRepository = threadRepository;
  }
  /**
   * @param {string} replyId
   * @param {string} threadId
   * @param {string} commentId
   * @param {string} owner
   */
  async execute(replyId, threadId, commentId, owner) {
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._repliesRepository.verifyAvailableReplies(replyId);
    await this._repliesRepository.verifyOwnerReplies(replyId, owner);
    await this._repliesRepository.deleteReply(replyId, commentId);
  }
}

module.exports = DeleteReplyUseCase;
