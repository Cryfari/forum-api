const ThreadTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
    '../../../Commons/exceptions/AuthorizationError',
);
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly',
        async () => {
          // arrange
          const newComment = new NewComment({
            content: 'ini comment',
          });
          await UsersTableTestHelper.addUser({});
          await ThreadTableTestHelper.addThread({});
          const fakeIdGenerator = () => '123';
          const commentRepositoryPostgres = new CommentRepositoryPostgres(
              pool, fakeIdGenerator,
          );

          // action
          const addedComment = await commentRepositoryPostgres
              .addComment(newComment, 'thread-123', 'user-123');

          // assert
          const comment = await CommentsTableTestHelper
              .findCommentById('comment-123');
          expect(comment).toHaveLength(1);
          expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: 'ini comment',
            owner: 'user-123',
          }));
        });
  });

  describe('deleteComment function', () => {
    it('should delete comment correcly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );

      // action
      await commentRepositoryPostgres
          .deleteComment('thread-123', 'comment-123');

      // assert
      const comment = await CommentsTableTestHelper
          .findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toEqual(true);
    });
  });

  describe('getAllCommentOfThread function', () => {
    it('showld get all comment of thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );
      await commentRepositoryPostgres
          .deleteComment('thread-123', 'comment-123');

      // action
      const comments = await commentRepositoryPostgres
          .getAllCommentsOfThread('thread-123');
      // assert
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('**komentar telah dihapus**');
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].content).toEqual('ini comment');
    });
  });

  describe('verifyAvilableComment function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // arrange
      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
          .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when comment available', async () => {
      // arrange
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(commentRepositoryPostgres.verifyAvailableComment(commentId))
          .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyOwnerComment function', () => {
    it('should throw AuthoricationError when not owner', async () => {
      // arrange
      const commentId = 'comment-123';
      const owner = 'user-456';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(commentRepositoryPostgres
          .verifyOwnerComment(commentId, owner))
          .rejects.toThrowError(AuthorizationError);
    });
    it('should not throw AuthorizationError when owner', async () => {
      // arrange
      const commentId = 'comment-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(commentRepositoryPostgres
          .verifyOwnerComment(commentId, owner))
          .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
