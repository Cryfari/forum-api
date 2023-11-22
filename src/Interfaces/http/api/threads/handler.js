const AddThreadUseCase = require(
    '../../../../Applications/use_case/threads/AddThreadUseCase',
);
const GetThreadUseCase = require(
    '../../../../Applications/use_case/threads/GetThreadUseCase',
);
const autoBind = require('auto-bind');

/**
 * threads handler
 */
class ThreadsHandler {
  /**
   * constructor for new object
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
  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const {id: credentialId} = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(
        request.payload,
        credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {object} request
   */
  async getThreadByIdHandler(request) {
    const {threadId} = request.params;
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(threadId);
    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
