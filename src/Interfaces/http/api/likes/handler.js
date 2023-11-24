const LikeCommentUseCase = require(
    '../../../../Applications/use_case/likes/LikeCommentUseCase',
);
const autoBind = require('auto-bind');
/**
 * likes handler
 */
class LikesHandler {
  /**
   * @param {object} container
   */
  constructor(container) {
    this._container = container;

    autoBind(this);
  }
  /**
   * @param {object} request
   */
  async putLikeHandler(request) {
    const {threadId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;

    const likeCommentUseCase = this._container
        .getInstance(LikeCommentUseCase.name);
    await likeCommentUseCase.execute(
        threadId,
        commentId,
        credentialId,
    );
    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;
