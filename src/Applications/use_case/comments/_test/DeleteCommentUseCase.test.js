const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // arrange
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    /** mocking needed function */
    mockCommentRepository.verifyAvailableComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyOwnerComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // action
    await deleteCommentUseCase.execute('thread-123', 'comment-123', 'user-123');

    expect(mockCommentRepository.verifyAvailableComment)
        .toBeCalledTimes(1);
    expect(mockCommentRepository.verifyAvailableComment)
        .toBeCalledWith('comment-123');
    expect(mockCommentRepository.verifyOwnerComment)
        .toBeCalledTimes(1);
    expect(mockCommentRepository.verifyOwnerComment)
        .toBeCalledWith('comment-123', 'user-123');
    expect(mockCommentRepository.deleteComment)
        .toBeCalledTimes(1);
    expect(mockCommentRepository.deleteComment)
        .toBeCalledWith('thread-123', 'comment-123');
  });
});
