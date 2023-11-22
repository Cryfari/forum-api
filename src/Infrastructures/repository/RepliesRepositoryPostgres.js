const RepliesRepository = require('../../Domains/replies/RepliesRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
    '../../Commons/exceptions/AuthorizationError',
);
const AddedReply = require('../../Domains/replies/entities/AddedReply');

/**
 * class implementation replies repository for postgres database
 */
class RepliesRepositoryPostgres extends RepliesRepository {
  /**
   * @param {object} pool
   * @param {object} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  /**
   * @param {object} payload
   * @param {string} commentId
   * @param {string} owner
   */
  async addReply(payload, commentId, owner) {
    const {content} = payload;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO replies VALUES($1, $2, $3, $4)
      RETURNING id, content, owner`,
      values: [id, content, owner, commentId],
    };
    const result = await this._pool.query(query);
    return new AddedReply({...result.rows[0]});
  }

  /**
   * @param {string} repliesId
   * @param {string} commentId
   */
  async deleteReply(repliesId, commentId) {
    const query = {
      text: `UPDATE replies
              SET is_delete = true
              WHERE id = $1 AND comment = $2`,
      values: [repliesId, commentId],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} commentId
   */
  async getAllRepliesOfComment(commentId) {
    const query = {
      text: `SELECT replies.id, 
              CASE 
                WHEN replies.is_delete THEN 
                  '**balasan telah dihapus**' 
                else 
                  replies.content 
                end content,
                replies.date,
                users.username
                FROM replies INNER JOIN users
                ON replies.owner = users.id AND replies.comment = $1
                ORDER BY replies.date ASC`,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * @param {string} repliesId
   */
  async verifyAvailableReplies(repliesId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1',
      values: [repliesId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Reply tidak ditemukan');
    }
  }

  /**
   * @param {string} repliesId
   * @param {string} owner
   */
  async verifyOwnerReplies(repliesId, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [repliesId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik replies');
    }
  }
}

module.exports = RepliesRepositoryPostgres;
