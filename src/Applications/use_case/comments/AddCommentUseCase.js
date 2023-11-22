const NewComment = require('../../../Domains/comments/entities/NewComment');

/**
 * class for add comment use case
 */
class AddCommentUseCase {
  /**
   * @param {object} param0
   */
  constructor({commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  /**
   * @param {object} useCasePayload
   * @param {string} threadId
   * @param {string} owner
   */
  async execute(useCasePayload, threadId, owner) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    return this._commentRepository.addComment(newComment, threadId, owner);
  }
}

module.exports = AddCommentUseCase;
