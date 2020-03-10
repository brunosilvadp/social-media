const {Sequelize, Model } = require('sequelize');

class AlbumItem extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.STORAGE_URL}/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Album, { foreignKey: `album_id` });
  }
}

module.exports = AlbumItem;
