const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const CommentRepository = require(
    '../../../../Domains/comments/CommentRepository',
);
const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);

const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  describe('when like', () => {
    it('should orchestrating the like comment use case correctly', async () => {
      // arrange
      const mockLikeRepository = new LikeRepository();
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.verifyAvailableThread = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyAvailableComment = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockLikeRepository.verifyUserLike = jest.fn()
          .mockImplementation(() => Promise.resolve(0));
      mockLikeRepository.like = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockLikeRepository.unLike = jest.fn()
          .mockImplementation(() => Promise.resolve());

      const likeCommentUseCase = new LikeCommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        likeRepository: mockLikeRepository,
      });
      // action
      await likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123');

      // assert
      expect(mockThreadRepository.verifyAvailableThread)
          .toBeCalledWith('thread-123');
      expect(mockCommentRepository.verifyAvailableComment)
          .toBeCalledWith('comment-123');
      expect(mockLikeRepository.verifyUserLike)
          .toBeCalledWith('comment-123', 'user-123');
      expect(mockLikeRepository.like)
          .toBeCalledWith('comment-123', 'user-123');
      expect(mockLikeRepository.unLike)
          .not.toBeCalled();
    });
  });
  describe('when unlike', () => {
    it('should orchestrating the like comment use case correctly', async () => {
      // arrange
      const mockLikeRepository = new LikeRepository();
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.verifyAvailableThread = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyAvailableComment = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockLikeRepository.verifyUserLike = jest.fn()
          .mockImplementation(() => Promise.resolve(1));
      mockLikeRepository.like = jest.fn()
          .mockImplementation(() => Promise.resolve());
      mockLikeRepository.unLike = jest.fn()
          .mockImplementation(() => Promise.resolve());

      const likeCommentUseCase = new LikeCommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        likeRepository: mockLikeRepository,
      });
      // action
      await likeCommentUseCase.execute('thread-123', 'comment-123', 'user-123');

      // assert
      expect(mockThreadRepository.verifyAvailableThread)
          .toBeCalledWith('thread-123');
      expect(mockCommentRepository.verifyAvailableComment)
          .toBeCalledWith('comment-123');
      expect(mockLikeRepository.verifyUserLike)
          .toBeCalledWith('comment-123', 'user-123');
      expect(mockLikeRepository.unLike)
          .toBeCalledWith('comment-123', 'user-123');
      expect(mockLikeRepository.like)
          .not.toBeCalled();
    });
  });
});
