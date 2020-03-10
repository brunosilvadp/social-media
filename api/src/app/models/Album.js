const {Sequelize, Model } = require('sequelize');

class Album extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: `user_id` });
    this.hasMany(models.AlbumItem, { onDelete: 'cascade' });
  }
}

module.exports = Album;
