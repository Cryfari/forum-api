const NewComment = require('../NewComment');

describe('NewComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // arrange
    const payload = {};

    // action and assert
    expect(() => new NewComment(payload))
        .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // arrange
    const payload = {
      content: 123,
    };

    // action and assert
    expect(() => new NewComment(payload))
        .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // arrange
    const payload = {
      content: 'comment123',
    };

    // action
    const newComment = new NewComment(payload);

    // assert
    expect(newComment.content).toEqual(payload.content);
  });
});
