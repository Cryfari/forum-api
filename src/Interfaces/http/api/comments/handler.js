const AddCommentUseCase = require(
    '../../../../Applications/use_case/comments/AddCommentUseCase',
);
const autoBind = require('auto-bind');
const DeleteCommentUseCase = require(
    '../../../../Applications/use_case/comments/DeleteCommentUseCase',
);

/**
 * comments handler
 */
class CommentHandler {
  /**
   * @param {object} container
   */
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  /**
   * @param {object} request
   * @param {object} h
   */
  async postCommentHandler(request, h) {
    const {threadId} = request.params;
    const addCommentUseCase = this._container.getInstance(
        AddCommentUseCase.name,
    );

    const {id: credentialId} = request.auth.credentials;
    const addedComment = await addCommentUseCase.execute(
        request.payload,
        threadId,
        credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
  /**
   * @param {object} request
   */
  async deleteCommentHandler(request) {
    const {threadId, commentId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(
        DeleteCommentUseCase.name,
    );
    await deleteCommentUseCase.execute(threadId, commentId, credentialId);
    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
