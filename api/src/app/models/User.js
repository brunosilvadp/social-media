const {Sequelize, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        city: Sequelize.STRING,
        promotion: Sequelize.BOOLEAN,
        banner: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.STORAGE_URL}/${this.banner}`;
          },
        },
        newsletter: Sequelize.BOOLEAN,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        verification: Sequelize.VIRTUAL,
        verification_token: Sequelize.STRING,
        email_verified_at: Sequelize.DATE
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) user.password_hash = await bcrypt.hash(user.password, 10);

      if(user.verification) user.verification_token = user.verification
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: `file_id`, as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
