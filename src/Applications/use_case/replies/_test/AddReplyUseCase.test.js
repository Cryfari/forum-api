const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
const RepliesRepository = require(
    '../../../../Domains/replies/RepliesRepository',
);
const AddedReply = require(
    '../../../../Domains/replies/entities/AddedReply',
);
const NewReply = require(
    '../../../../Domains/replies/entities/NewReply',
);

describe('AddReplyUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // arrange
    const useCasePayload = {
      content: 'ini reply',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockRepliesRepository.addReply = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    });

    // Action
    const addedReply = await addReplyUseCase
        .execute(useCasePayload, 'comment-123', 'thread-123', 'user-123');

    // assert
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyAvailableThread)
        .toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyAvailableComment)
        .toBeCalledWith('comment-123');
    expect(mockRepliesRepository.addReply).toBeCalledWith(
        new NewReply({
          content: useCasePayload.content,
        }),
        'comment-123',
        'user-123',
    );
  });
});
