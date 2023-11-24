const LikeRepository = require('../LikeRepository');

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();
    // Action and Assert
    await expect(likeRepository.like('')).rejects
        .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.unLike('')).rejects
        .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.verifyUserLike('', '')).rejects
        .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountOfComment('')).rejects
        .toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
