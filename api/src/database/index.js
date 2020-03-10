const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const databaseConfig = require('../config/database');

const Album = require('../app/models/Album');
const AlbumItem = require('../app/models/AlbumItem');
const File = require('../app/models/File');
const Post = require('../app/models/Post');
const User = require('../app/models/User');

const models = [Album, AlbumItem, File, Post, User];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL, {
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      }
    });

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

module.exports = new Database();
