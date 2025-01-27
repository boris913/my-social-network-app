'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Comments', 'Comments_tweetId_fkey');
    await queryInterface.removeConstraint('Comments', 'Comments_parentCommentId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_tweetId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_commentId_fkey');
    await queryInterface.removeConstraint('Retweets', 'Retweets_tweetId_fkey');
    await queryInterface.removeConstraint('Shares', 'Shares_tweetId_fkey');

    await queryInterface.addConstraint('Comments', {
      fields: ['tweetId'],
      type: 'foreign key',
      name: 'Comments_tweetId_fkey',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Comments', {
      fields: ['parentCommentId'],
      type: 'foreign key',
      name: 'Comments_parentCommentId_fkey',
      references: {
        table: 'Comments',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Likes', {
      fields: ['tweetId'],
      type: 'foreign key',
      name: 'Likes_tweetId_fkey',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Likes', {
      fields: ['commentId'],
      type: 'foreign key',
      name: 'Likes_commentId_fkey',
      references: {
        table: 'Comments',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Retweets', {
      fields: ['tweetId'],
      type: 'foreign key',
      name: 'Retweets_tweetId_fkey',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Shares', {
      fields: ['tweetId'],
      type: 'foreign key',
      name: 'Shares_tweetId_fkey',
      references: {
        table: 'Tweets',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Comments', 'Comments_tweetId_fkey');
    await queryInterface.removeConstraint('Comments', 'Comments_parentCommentId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_tweetId_fkey');
    await queryInterface.removeConstraint('Likes', 'Likes_commentId_fkey');
    await queryInterface.removeConstraint('Retweets', 'Retweets_tweetId_fkey');
    await queryInterface.removeConstraint('Shares', 'Shares_tweetId_fkey');

    // Optionnellement, vous pouvez ajouter les anciennes contraintes sans l'option onDelete: 'CASCADE'
  }
};