const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

/**
 * class implementation thread repository for postgres database
 */
class ThreadRepositoryPostgres extends ThreadRepository {
  /**
   * constructor for new object
   * @param {object} pool
   * @param {object} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * function for add thread
   * @param {object} newThread
   * @param {string} owner
   */
  async addThread(newThread, owner) {
    const {title, body} = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO threads VALUES($1, $2, $3, $4)
              RETURNING id, title, owner`,
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({...result.rows[0]});
  }
  /**
   * @param {string} threadId
   */
  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body,
                    threads.date, users.username
              FROM threads INNER JOIN users
              ON threads.owner = users.id AND threads.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }
  /**
   * get all threads from database
   */
  async getAllThread() {
    const query = `SELECT threads.id, threads.title, threads.body,
                    threads.date, users.username
                    FROM threads LEFT JOIN users
                    ON threads.owner = users.id
                    ORDER BY threads.date DESC`;
    const result = await this._pool.query(query);
    return result.rows;
  }
  /**
   * @param {string} threadId
   */
  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
