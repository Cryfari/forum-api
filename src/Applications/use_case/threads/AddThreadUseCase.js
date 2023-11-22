const NewThread = require('../../../Domains/threads/entities/NewThread');

/**
 * class for add thread use case
 */
class AddThreadUseCase {
  /**
   * constructor for new object
   * @param {object} param0
   */
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  /**
   * function for execute add thread process
   * @param {object} useCasePayload
   * @param {string} owner
   */
  async execute(useCasePayload, owner) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, owner);
  }
}

module.exports = AddThreadUseCase;
