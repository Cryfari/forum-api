const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require(
    '../../../../Domains/comments/entities/AddedComment',
);

const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment use case correctly', async () => {
    // arrange
    const useCasePayload = {
      content: 'ini comment',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // action
    const addedComment = await addCommentUseCase.execute(
        useCasePayload, 'thread-123', 'user-123',
    );

    // assert
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
    }), 'thread-123', 'user-123');
  });
});
