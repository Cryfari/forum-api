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
const RepliesTableTestHelper = require(
    '../../../../tests/RepliesTableTestHelper',
);
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini replies',
      };
      const threadId = 'xxx';
      const commentId = 'xxx';
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
    it('response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini replies',
      };
      const threadId = 'thread-123';
      const commentId = 'xxx';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });
    it('response 400 when request payload not meet data type specification',
        async () => {
          // Arrange
          const requestPayload = {
            content: 123,
          };
          const threadId = 'thread-123';
          const commentId = 'comment-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId}/replies`,
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
    it('should response 400 when request payload not contain needed property',
        async () => {
          // Arrange
          const requestPayload = {};
          const threadId = 'thread-123';
          const commentId = 'comment-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: `/threads/${threadId}/comments/${commentId}/replies`,
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

    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'ini reply',
      };
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const accessToken = await TokenTestHelper.createAccessToken();
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
      expect(
          await RepliesTableTestHelper
              .findReplyById(responseJson.data.addedReply.id)).toHaveLength(1);
    });
  });

  describe(
      'when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}',
      () => {
        it('should response 404 when thread not found', async () => {
          // Arrange
          const threadId = 'xxx';
          const commentId = 'xxx';
          const replyId = 'xxx';
          const accessToken = await TokenTestHelper.createAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/
            ${commentId}/replies/${replyId}`,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
        it('should response 404 when comment not found', async () => {
          // Arrange
          const threadId = 'thread-123';
          const commentId = 'xxx';
          const replyId = 'xxx';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('Komentar tidak ditemukan');
        });
        it('should response 404 when reply not found', async () => {
          // Arrange
          const threadId = 'thread-123';
          const commentId = 'comment-123';
          const replyId = 'xxx';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('Reply tidak ditemukan');
        });
        it('should response 403 when delete with other user', async () => {
          // Arrange
          const threadId = 'thread-123';
          const commentId = 'comment-123';
          const replyId = 'reply-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({
            id: 'user-456',
            username: 'dico',
          });
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          await RepliesTableTestHelper.addReply({
            owner: 'user-456',
          });
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(403);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('anda bukan pemilik replies');
        });
        it('should response 200 and delete replies', async () => {
          // Arrange
          const threadId = 'thread-123';
          const commentId = 'comment-123';
          const replyId = 'reply-123';
          const accessToken = await TokenTestHelper.createAccessToken();
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});
          await CommentsTableTestHelper.addComment({});
          await RepliesTableTestHelper.addReply({});
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'DELETE',
            url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(200);
          expect(responseJson.status).toEqual('success');
        });
      });
});
