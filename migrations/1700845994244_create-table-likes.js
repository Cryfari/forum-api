/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
      'likes',
      'fk_likes.comment_comments.id',
      'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
      'likes',
      'fk_likes.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
      'likes',
      'unique_comment_and_owner',
      'UNIQUE(comment, owner)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
