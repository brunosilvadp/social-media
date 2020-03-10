const AlbumItem = require('../models/AlbumItem');
const Album = require('../models/Album');
const Post = require('../models/Post');
const User = require('../models/User');
const notificationController = require('../controllers/NotificationController')
class AlbumItemController {
  async store(req, res) {
    const { originalname: name, path } = req.file;
    const { album_id } = req.body;
    const { name: username } = await User.findByPk(req.userId);
    const { name: albumName } = await Album.findByPk(album_id);
    

    const subtitle = `${username} acabou de adicionar uma nova foto ao àlbum ${albumName}!<a class="album-link" href="/albuns/${album_id}"> Clique aqui para visualizar o álbum completo</a>`
    
    await notificationController.store({
      notification: `${username} adicionou uma nova foto no álbum`,
      type: 'album',
      user: req.userId,
      content_id: album_id,
      checked: false
    })
    
    await Post.create({ subtitle, user_id: req.userId });
    
    const file = await AlbumItem.create({ name, path, album_id });

    return res.json(file);
  }

  async delete(req, res) {
    const { id } = req.params;

    await AlbumItem.destroy({ where: { id: [id] } });

    return res.json(201);
  }

  async findByAlbumId(req, res){
    const { id } = req.params;
    let result = await AlbumItem.findAll({
      where: {
        album_id: id
      },
      order: [
        ['id', 'DESC']
      ],
      include: [{
        model: Album
      }]
    });
    
    if(!result.length){
      result = await Album.findAll({
        where: {
          id: id
        }
      })
    }
    return res.json(result);
  }
}

module.exports = new AlbumItemController();
