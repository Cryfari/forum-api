const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require(
    '../../Commons/exceptions/AuthorizationError',
);
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

/**
 * class implementation comment repository for postgres database
 */
class CommentRepositoryPostgres extends CommentRepository {
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
   * function for add new comment
   * @param {object} payload
   * @param {string} threadId
   * @param {string} owner
   */
  async addComment(payload, threadId, owner) {
    const {content} = payload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comments VALUES($1, $2, $3, $4)
              RETURNING id, content, owner`,
      values: [id, owner, content, threadId],
    };

    const result = await this._pool.query(query);

    return new AddedComment({...result.rows[0]});
  }

  /**
   * @param {string} threadId
   * @param {string} commentId
   */
  async deleteComment(threadId, commentId) {
    const query = {
      text: `UPDATE comments
              SET is_delete = true
              WHERE id = $1 AND thread = $2`,
      values: [commentId, threadId],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} threadId
   */
  async getAllCommentsOfThread(threadId) {
    const query = {
      text: `SELECT comments.id, 
              CASE 
                WHEN comments.is_delete THEN 
                  '**komentar telah dihapus**' 
                else 
                  comments.content 
                end content,
                comments.date,
                users.username
                FROM comments INNER JOIN users
                ON comments.owner = users.id AND comments.thread = $1
                ORDER BY comments.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * @param {string} commentId
   */
  async verifyAvailableComment(commentId) {
    const query = {
      text: 'SELECT * from comments WHERE id = $1 AND is_delete = false',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async verifyOwnerComment(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Bukan pemilik komentar');
    }
  }
}

module.exports = CommentRepositoryPostgres;
