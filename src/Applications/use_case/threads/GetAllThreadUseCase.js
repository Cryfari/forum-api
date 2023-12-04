class GetAllThreadUseCase {
  constructor({threadRepository}) {
    this._threadRepository = threadRepository;
  }

  async execute() {
    return this._threadRepository.getAllThread();
  }
}

module.exports = GetAllThreadUseCase;
