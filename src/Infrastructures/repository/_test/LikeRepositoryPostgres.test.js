const ThreadTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);
const LikesTableTestHelper = require(
    '../../../../tests/LikesTableTestHelper',
);
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('like function', () => {
    it('should persist likes', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, fakeIdGenerator,
      );

      // action
      await likeRepositoryPostgres.like('comment-123', 'user-123');

      // assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like[0].id).toEqual('like-123');
      expect(like[0].comment).toEqual('comment-123');
      expect(like[0].owner).toEqual('user-123');
    });
  });
  describe('unLike function', () => {
    it('should delete likes', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
      );

      // action
      await likeRepositoryPostgres.unLike('comment-123', 'user-123');

      // assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(0);
    });
  });
  describe('verifyUserLike function', () => {
    it('should return 1 when user like', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
      );

      // action
      const result = await likeRepositoryPostgres
          .verifyUserLike('comment-123', 'user-123');

      // assert
      expect(result).toEqual(1);
    });
    it('should return 0 when user not like', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
      );

      // action
      const result = await likeRepositoryPostgres
          .verifyUserLike('comment-123', 'user-123');

      // assert
      expect(result).toEqual(0);
    });
  });
  describe('unLike function', () => {
    it('should return count like of comment correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'dico',
      });
      await ThreadTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      await LikesTableTestHelper.addLike({
        id: 'like-456',
        owner: 'user-456',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
          pool, {},
      );

      // action
      const result = await likeRepositoryPostgres
          .getLikeCountOfComment('comment-123');

      // assert
      expect(result).toEqual(2);
    });
  });
});
