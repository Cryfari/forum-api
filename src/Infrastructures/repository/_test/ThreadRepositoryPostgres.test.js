const ThreadTableTestHelper = require(
    '../../../../tests/ThreadsTableTestHelper',
);
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly',
        async () => {
          // arrange
          const newThread = new NewThread({
            title: 'ini title',
            body: 'ini body',
          });
          await UsersTableTestHelper.addUser({});
          const fakeIdGenerator = () => '123';
          const threadRepositoryPostgres = new ThreadRepositoryPostgres(
              pool, fakeIdGenerator,
          );

          // action
          const addedThread = await threadRepositoryPostgres
              .addThread(newThread, 'user-123');

          // assert
          const threads = await ThreadTableTestHelper
              .findThreadById('thread-123');
          expect(threads).toHaveLength(1);
          expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: 'ini title',
            owner: 'user-123',
          }));
        });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId))
          .rejects.toThrowError(NotFoundError);
    });
    it('should not throw NotFoundError when thread available', async () => {
      // arrange
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool, {},
      );

      // action and assert
      await expect(threadRepositoryPostgres.verifyAvailableThread(threadId))
          .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return a thread correcly', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});

      // action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');
      // assert
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toBeDefined();
      expect(thread.body).toBeDefined();
      expect(thread.date).toBeDefined();
      expect(thread.username).toBeDefined();
    });
  });
  describe('getAllThread function', () => {
    it('should return all thread correcly', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      await ThreadTableTestHelper.addThread({
        id: 'thread-234',
      });

      // action
      const thread = await threadRepositoryPostgres.getAllThread();
      console.log(thread);
      // assert
      expect(Array.isArray(thread)).toBe(true);
      expect(thread).toHaveLength(2);
      expect(thread[0].id).toEqual('thread-234');
      expect(thread[0].title).toBeDefined();
      expect(thread[0].body).toBeDefined();
      expect(thread[0].date).toBeDefined();
      expect(thread[0].username).toBeDefined();
      expect(thread[1].id).toEqual('thread-123');
      expect(thread[1].title).toBeDefined();
      expect(thread[1].body).toBeDefined();
      expect(thread[1].date).toBeDefined();
      expect(thread[1].username).toBeDefined();
    });
  });
});
