/**
 * class for get thread use case
 */
class GetThreadUseCase {
  /**
   * @param {object} param0
   */
  constructor({
    threadRepository,
    commentRepository,
    repliesRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._repliesRepository = repliesRepository;
    this._likeRepository = likeRepository;
  }

  /**
   * @param {string} threadId
   */
  async execute(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository
        .getAllCommentsOfThread(threadId);
    for (let i = 0; i < comments.length; i++) {
      const likes = await this._likeRepository
          .getLikeCountOfComment(comments[i].id);
      const replies = await this._repliesRepository
          .getAllRepliesOfComment(comments[i].id);
      comments[i].replies = replies;
      comments[i].likeCount = likes;
    }
    thread.comments = comments;
    return thread;
  }
}

module.exports = GetThreadUseCase;
