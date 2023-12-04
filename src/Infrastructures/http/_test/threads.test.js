const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require(
    '../../../../tests/UsersTableTestHelper',
);
const LikesTableTestHelper = require(
    '../../../../tests/LikesTableTestHelper',
);
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require(
    '../../../../tests/CommentsTableTestHelper',
);

describe('/threads endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'ini title',
        body: 'ini body',
      };
      const accessToken = await TokenTestHelper.createAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          authorization: 'Bearer ' + accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
    it('response 400 when request payload not contain needed property',
        async () => {
          // Arrange
          const requestPayload = {
            title: 'ini title',
          };
          const accessToken = await TokenTestHelper.createAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: requestPayload,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message)
              .toEqual('harus mengirimkan title dan body');
        });

    it('response 400 when request payload not meet data type specification',
        async () => {
          // Arrange
          const requestPayload = {
            title: 'ini title',
            body: 123,
          };
          const accessToken = await TokenTestHelper.createAccessToken();
          const server = await createServer(container);

          // Action
          const response = await server.inject({
            method: 'POST',
            url: '/threads',
            payload: requestPayload,
            headers: {
              authorization: 'Bearer ' + accessToken,
            },
          });

          // Assert
          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(400);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('title dan body harus string');
        });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and provide thread details', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });


      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toBeDefined();
      expect(responseJson.data.thread.title).toBeDefined();
      expect(responseJson.data.thread.body).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments[0].likeCount).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
    });
    it('should response 404 when not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
  describe('when GET /threads', () => {
    it('should response 200 and provide all thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-456',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads',
      });


      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.threads).toBeDefined();
      expect(Array.isArray(responseJson.data.threads)).toBe(true);
      expect(responseJson.data.threads[0].id).toEqual('thread-456');
      expect(responseJson.data.threads[0].title).toBeDefined();
      expect(responseJson.data.threads[0].body).toBeDefined();
      expect(responseJson.data.threads[0].date).toBeDefined();
      expect(responseJson.data.threads[0].username).toBeDefined();
      expect(responseJson.data.threads[1].id).toEqual('thread-123');
      expect(responseJson.data.threads[1].title).toBeDefined();
      expect(responseJson.data.threads[1].body).toBeDefined();
      expect(responseJson.data.threads[1].date).toBeDefined();
      expect(responseJson.data.threads[1].username).toBeDefined();
    });
  });
});
