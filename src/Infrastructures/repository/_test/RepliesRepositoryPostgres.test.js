const ThreadTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);
const RepliesTableTestHelper = require(
    '../../../../tests/RepliesTableTestHelper',
);
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
    '../../../Commons/exceptions/AuthorizationError',
);
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly',
        async () => {
          // arrange
          const newReply= new NewReply({
            content: 'ini reply',
          });
          await UsersTableTestHelper.addUser({});
          await ThreadTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const fakeIdGenerator = () => '123';
          const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
              pool, fakeIdGenerator,
          );

          // action
          const addedReply = await repliesRepositoryPostgres
              .addReply(newReply, 'comment-123', 'user-123');

          // assert
          const reply = await RepliesTableTestHelper
              .findReplyById('reply-123');
          expect(reply).toHaveLength(1);
          expect(addedReply).toStrictEqual(new AddedReply({
            id: 'reply-123',
            content: 'ini reply',
            owner: 'user-123',
          }));
        });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );

      // action
      await repliesRepositoryPostgres
          .deleteReply('reply-123', 'comment-123');

      // assert
      const reply = await RepliesTableTestHelper
          .findReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(reply[0].is_delete).toEqual(true);
    });
  });

  describe('getAllCommentOfThread function', () => {
    it('showld get all comment of thread', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
      });
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );
      await repliesRepositoryPostgres
          .deleteReply('reply-123', 'comment-123');

      // action
      const replies = await repliesRepositoryPostgres
          .getAllRepliesOfComment('comment-123');
      // assert
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('**balasan telah dihapus**');
      expect(replies[1].id).toEqual('reply-456');
      expect(replies[1].content).toEqual('ini reply');
    });
  });

  describe('verifyAvilableComment function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      // arrange
      const replyId = 'reply-123';
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(repliesRepositoryPostgres.verifyAvailableReplies(replyId))
          .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when reply available', async () => {
      // arrange
      const replyId = 'reply-123';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(repliesRepositoryPostgres.verifyAvailableReplies(replyId))
          .resolves.not.toThrowError(NotFoundError);
    });
  });
  describe('verifyOwnerComment function', () => {
    it('should throw AuthoricationError when not owner', async () => {
      // arrange
      const replyId = 'reply-123';
      const owner = 'user-456';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(repliesRepositoryPostgres
          .verifyOwnerReplies(replyId, owner))
          .rejects.toThrowError(AuthorizationError);
    });
    it('should not throw AuthorizationError when owner', async () => {
      // arrange
      const replyId = 'reply-123';
      const owner = 'user-123';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(repliesRepositoryPostgres
          .verifyOwnerReplies(replyId, owner))
          .resolves.not.toThrowError(AuthorizationError);
    });
  });
});
