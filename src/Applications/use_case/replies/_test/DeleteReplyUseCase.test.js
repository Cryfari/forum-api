const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
const RepliesRepository = require(
    '../../../../Domains/replies/RepliesRepository',
);
const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // arrange
    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.verifyOwnerReplies = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.verifyAvailableReplies = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.deleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockRepliesRepository,
    });

    // action
    await deleteReplyUseCase
        .execute('reply-123', 'thread-123', 'comment-123', 'user-123');

    // assert
    expect(mockCommentRepository.verifyAvailableComment)
        .toBeCalledWith('comment-123');
    expect(mockThreadRepository.verifyAvailableThread)
        .toBeCalledWith('thread-123');
    expect(mockRepliesRepository.verifyAvailableReplies)
        .toBeCalledWith('reply-123');
    expect(mockRepliesRepository.verifyOwnerReplies)
        .toBeCalledWith('reply-123', 'user-123');
    expect(mockRepliesRepository.deleteReply)
        .toBeCalledWith('reply-123', 'comment-123');
  });
});
