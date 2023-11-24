const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);
const LikesTableTestHelper = require(
    '../../../../tests/LikesTableTestHelper',
);
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  describe('when put and not yet liked by user', () => {
    it('should response 200 and persisted like', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/xxx/comments/${commentId}/likes`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
    it('should response 404 when comment not found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/xxx/likes`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
  describe('when put and not user already like', () => {
    it('should response 200 and delete like', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(like).toHaveLength(0);
    });
  });
});
