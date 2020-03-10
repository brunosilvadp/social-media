const Album = require('../models/Album');
const Sequelize = require('sequelize');

const Timeline = require('../schemas/Timeline');

const databaseConfig = require('../../config/database');
class AlbumController {
  async index(req, res) {
    
    var sequelize = new Sequelize(process.env.DATABASE_URL, {
      define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
      }
    });
    const results = await sequelize.query(
      `SELECT Album.id, Album.name, COUNT(AlbumItems.album_id) AS QuantityPhotos, (SELECT ai.path FROM album_items AS ai WHERE ai.album_id = Album.id ORDER BY created_at DESC LIMIT 1) AS path FROM albums AS Album LEFT JOIN album_items AS AlbumItems ON Album.id = AlbumItems.album_id WHERE Album.user_id = ${req.userId} GROUP BY Album.id ORDER BY Album.created_at`
    );
    return res.json(results[0]);
  }

  async store(req, res) {
    const { name } = req.body;
    const user_id = req.userId;
    
    const album = await Album.create({ name, user_id });

    await Timeline.create({
      user: req.userId,
      type: 'albums',
      item: album.id,
      activity: 'create',
    });

    return res.json(album);
  }

  async delete(req, res) {
    const { id } = req.params;

    const album = await Album.findByPk(id);

    if (album.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorization' });
    }

    await Album.destroy({ where: { id: [id] }, truncate: { cascade: true } });

    return res.json(201);
  }
}

module.exports = new AlbumController();
