const {Sequelize, Model } = require('sequelize');

class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        subtitle: Sequelize.STRING,
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.STORAGE_URL}/${this.path}`;
          },
        },
        comments_quantity: Sequelize.INTEGER
      },
      {
        sequelize,
      }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: `user_id` });
  }
}

module.exports = Post;
