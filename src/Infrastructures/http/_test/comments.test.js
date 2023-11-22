const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require(
    '../../../../tests/UsersTableTestHelper',
);
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini comment',
      };
      const threadId = 'thread-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
      expect(
          await CommentsTableTestHelper
              .findCommentById(responseJson.data.addedComment.id),
      ).toHaveLength(1);
    });
    it('response 400 when request payload not contain needed property',
        async () => {
          // Arrange
          const requestPayload = {};
          const threadId = 'thread-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('harus mengirimkan content');
        });
    it('response 400 when request payload not meet data type specification',
        async () => {
          // Arrange
          const requestPayload = {
            content: 123,
          };
          const threadId = 'thread-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments`,
            payload: requestPayload,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('content harus string');
        });
    it('should response 404 when not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini comment',
      };
      const threadId = 'thread-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
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
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      const comment = await CommentsTableTestHelper
          .findCommentById('comment-123');
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(comment).toHaveLength(1);
      expect(comment[0].is_delete).toEqual(true);
    });

    it('should response 403 when delete with other user', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'dico',
      });
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({
        owner: 'user-456',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
});
