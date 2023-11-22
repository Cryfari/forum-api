const AddReplyUseCase = require(
    '../../../../Applications/use_case/replies/AddReplyUseCase',
);
const DeleteReplyUseCase = require(
    '../../../../Applications/use_case/replies/DeleteReplyUseCase',
);
const autoBind = require('auto-bind');
/**
 * replies handler
 */
class RepliesHandler {
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
  async postRepliesHandler(request, h) {
    const {threadId, commentId} = request.params;
    const addReplyUsecase = this._container.getInstance(AddReplyUseCase.name);
    const {id: credentialId} = request.auth.credentials;

    const addedReply = await addReplyUsecase.execute(
        request.payload,
        commentId,
        threadId,
        credentialId,
    );
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
  /**
   * @param {object} request
   */
  async deleteRepliesHandler(request) {
    const {threadId, commentId, replyId} = request.params;
    const {id: credentialId} = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(
        DeleteReplyUseCase.name,
    );
    await deleteReplyUseCase.execute(
        replyId,
        threadId,
        commentId,
        credentialId,
    );
    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
