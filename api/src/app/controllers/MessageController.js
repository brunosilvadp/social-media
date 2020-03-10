const Message = require('../schemas/Message');
const User = require('../models/User');
const File = require('../models/File');
const cryptoMessage = require('../services/Crypto');
const notificationController = require('../controllers/NotificationController');
class MessageController {
  async index(req, res) {
    let message = await Message.aggregate([
      {
        $match: {
          $or: [{user_destinatary: req.userId}, {user_send: req.userId}]
        }
      },
      // {
      //   $group : {
      //     _id: "$user_destinatary",
      //      message: {$mergeObjects: {message: "$message"}}
      //   }
      // }
    ]);
    
    // console.log(message.filter(m => m.user_destinatary === parseInt(req.params.id) || m.user_send === parseInt(req.params.id)).length > 0);

    if(req.params.id !== 0){
      if(!message.filter(m => m.user_destinatary === parseInt(req.params.id) || m.user_send === parseInt(req.params.id)).length > 0){
        message = [{user_destinatary: req.params.id, }].concat(message);
      }
    }
    const users = await User.findAll({
      // order: [['id', 'desc']],
      where: {
        id: message.map(message => {
          if(message.user_destinatary !== req.userId){
            return message.user_destinatary;  
          }else if(message.user_send !== req.userId)
           return message.user_send;
        })
      },
      include: {
        model: File,
        as: "avatar"
      }
    })
    return res.json({users, message});
  }

  async loadMessages(req, res){
    const messages = await Message.find(
      {
        $or: [
          { $and: [{user_destinatary: req.params.id}, {user_send: req.userId}] },
          { $and: [{user_destinatary: req.userId}, {user_send: req.params.id}] },
        ]
      },
      {
        user_followed: 1,
        user_destinatary: 1,
        user_send: 1,
        message: 1,
        _id: 0
      })

      const {name} = await User.findByPk(req.params.id)
      return res.json({name, messages})
  }

  async store(req, res) {
    const message = await Message.create({
      user_send: req.userId,
      user_destinatary: req.body.user_destinatary,
      message: cryptoMessage.encrypt(req.body.message),
    });

    const user = await User.findByPk(req.userId)

    await notificationController.store({
      notification: user.name + " te enviou uma nova mensagem",
      type: 'message',
      user: req.body.user_destinatary,
      content_id: req.userId,
      checked: false
    })

    return res.json(message);
  }

  async update(req, res) {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        checked: req.body.checked,
      },
      { new: true }
    );

    return res.json(message);
  }
}

module.exports = new MessageController();
