/**
 * class for tread repo
 */
class ThreadRepository {
  /**
   * abstract function for add a thread
   * @param {object} payload
   */
  async addThread(payload) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for get a thread
   * @param {String} threadId
   */
  async getThreadById(threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for get all thread
   */
  async getAllThread() {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  /**
   * abstract function for check available thread
   * @param {String} threadId
   */
  async verifyAvailableThread(threadId) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ThreadRepository;
