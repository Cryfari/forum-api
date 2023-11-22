const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // arrange
    const payload = {};

    // action anf assert
    expect(() => new NewReply(payload))
        .toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action & Assert
    expect(() => new NewReply(payload))
        .toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      content: 'ini reply',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(NewReply);
    expect(newReply.content).toEqual(payload.content);
  });
});
