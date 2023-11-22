const RepliesRepository = require('../RepliesRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const repliesRepository = new RepliesRepository();

    // Action and Assert
    await expect(repliesRepository.addReply({}, '', '')).rejects
        .toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.deleteReply({})).rejects
        .toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.verifyAvailableReplies('')).rejects
        .toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.verifyOwnerReplies('', '')).rejects
        .toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(repliesRepository.getAllRepliesOfComment('')).rejects
        .toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
