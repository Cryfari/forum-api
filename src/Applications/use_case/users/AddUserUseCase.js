const RegisterUser = require('../../../Domains/users/entities/RegisterUser');

/**
 * class for add user use case
 */
class AddUserUseCase {
  /**
   * constructor for new object
   * @param {object} param0
   */
  constructor({userRepository, passwordHash}) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  /**
   * function for execute add user process
   * @param {object} useCasePayload
   */
  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash
        .hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
