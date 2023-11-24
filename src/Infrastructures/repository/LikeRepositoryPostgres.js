const LikeRepository = require('../../Domains/likes/LikeRepository');
/**
 * class like repositori for postgres
 */
class LikeRepositoryPostgres extends LikeRepository {
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
   * @param {string} commentId
   * @param {string} owner
   */
  async like(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };
    await this._pool.query(query);
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async unLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment = $1 AND owner = $2',
      values: [commentId, owner],
    };
    await this._pool.query(query);
  }
  /**
   * @param {string} commentId
   * @param {string} owner
   */
  async verifyUserLike(commentId, owner) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }
  /**
   * @param {string} commentId
   */
  async getLikeCountOfComment(commentId) {
    const query = {
      text: 'SELECT COUNT(id) as likecount FROM likes WHERE comment = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].likecount;
  }
}

module.exports = LikeRepositoryPostgres;
