const NewReply = require('../../../Domains/replies/entities/NewReply');
/**
 * class for add thread use case
 */
class AddReplyUseCase {
  /**
   * constructor for new object
   * @param {object} param0
   */
  constructor({repliesRepository, commentRepository, threadRepository}) {
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._threadRepository = threadRepository;
  }
  /**
   * @param {object} useCasePayload
   * @param {string} commentId
   * @param {string} threadId
   * @param {string} owner
   */
  async execute(useCasePayload, commentId, threadId, owner) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    return this._repliesRepository.addReply(newReply, commentId, owner);
  }
}

module.exports = AddReplyUseCase;
