const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');
const ThreadRepository = require(
    '../../../../Domains/threads/ThreadRepository',
);

const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orcestrating the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'ini title',
      body: 'ini body',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'owner',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const addedThread = await addThreadUseCase.execute(useCasePayload, 'owner');

    // assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'owner',
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'ini title',
      body: 'ini body',
    }), 'owner');
  });
});
