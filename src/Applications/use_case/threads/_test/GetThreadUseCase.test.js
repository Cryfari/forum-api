const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
const RepliesRepository = require(
    '../../../../Domains/replies/RepliesRepository',
);
const LikeRepository = require(
    '../../../../Domains/likes/LikeRepository',
);
const GetThreadUsecase = require('../GetThreadUseCase');

describe('GetThreadUsecase', () => {
  it('should orcestrating the add thread action correctly', async () => {
    // arrange
    const thread = {
      id: 'thread-123',
    };
    const comments = [
      {
        id: 'comment-123',
      },
    ];
    const replies = [
      {
        id: 'reply-123',
      },
    ];
    const likeCount = '2';
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockRepliesRepository = new RepliesRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
        .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getAllCommentsOfThread = jest.fn()
        .mockImplementation(() => Promise.resolve(comments));
    mockRepliesRepository.getAllRepliesOfComment = jest.fn()
        .mockImplementation(() => Promise.resolve(replies));
    mockLikeRepository.getLikeCountOfComment = jest.fn()
        .mockImplementation(() => Promise.resolve(likeCount));

    const getThreadUseCase = new GetThreadUsecase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
      likeRepository: mockLikeRepository,
    });

    // action
    const result = await getThreadUseCase.execute(thread.id);

    // assert
    comments[0].replies = replies;
    thread.comments = comments;
    expect(result).toStrictEqual(thread);
    expect(mockThreadRepository.verifyAvailableThread)
        .toBeCalledWith(thread.id);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(thread.id);
    expect(mockCommentRepository.getAllCommentsOfThread)
        .toBeCalledWith(thread.id);
    expect(mockRepliesRepository.getAllRepliesOfComment)
        .toBeCalledWith(comments[0].id);
  });
});
