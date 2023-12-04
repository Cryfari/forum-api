const GetAllThreadUseCase = require('../GetAllThreadUseCase');

const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);

describe('GetThreadUsecase', () => {
  it('should orcestrating the add thread action correctly', async () => {
    // arrange
    const threads = [
      {
        id: 'thread-123',
      },
      {
        id: 'thread-234',
      },
    ];
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getAllThread = jest.fn()
        .mockImplementation(() => Promise.resolve(threads));

    const getAllThreadUseCase = new GetAllThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const result = await getAllThreadUseCase.execute();

    // assert
    expect(result).toStrictEqual(threads);
  });
});
