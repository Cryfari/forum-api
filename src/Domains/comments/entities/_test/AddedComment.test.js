const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload not contain property', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'this comment',
    };

    // action and assert
    expect(() => new AddedComment(payload))
        .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payoad not meet data tpe specification', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'this comment',
      owner: 123,
    };

    // action and assert
    expect(() => new AddedComment(payload))
        .toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // arrange
    const payload = {
      id: 'comment-123',
      content: 'this comment',
      owner: 'owner',
    };

    // action
    const addedComment = new AddedComment(payload);

    // assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
