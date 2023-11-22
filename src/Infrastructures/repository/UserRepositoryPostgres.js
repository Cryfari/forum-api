const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

/**
 * class implementation user repository for postgres database
 */
class UserRepositoryPostgres extends UserRepository {
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
   * function for verify available username from database
   * @param {string} username
   */
  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  /**
   * function for add new user
   * @param {object} registerUser
   */
  async addUser(registerUser) {
    const {username, password, fullname} = registerUser;
    const id = `user-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO users VALUES($1, $2, $3, $4)
              RETURNING id, username, fullname`,
      values: [id, username, password, fullname],
    };

    const result = await this._pool.query(query);

    return new RegisteredUser({...result.rows[0]});
  }

  /**
   * function for get password by username from database
   * @param {string} username
   */
  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  /**
   * function for get id by username from database
   * @param {string} username
   */
  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const {id} = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
