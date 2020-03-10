const Comment = require('../schemas/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const File = require('../models/File');
const notificationController = require('../controllers/NotificationController');

class CommentController {
  async index(req, res) {
    const comments = await Comment.find({
      post: req.params.id,
    }).sort({
      createdAt: -1
    }).limit(10);

    return res.json(comments);
  }

  async store(req, res) {
    const post = await Post.findByPk(req.body.postId);
    await post.update({comments_quantity: post.comments_quantity + 1});
    
    const user = await User.findAll({
      where: {
        id: req.userId
      },
      include: {
        model: File,
        as: "avatar"
      }
    });

    await notificationController.store({
      notification: user[0].name + " fez um comentário em um post",
      type: 'comment',
      user: req.userId,
      content_id: post.id,
      checked: false,
    })

    const comment = await Comment.create({
      user: req.userId,
      post: req.body.postId,
      type: req.body.type,
      comment: req.body.comment,
      avatar: (user[0].avatar) ? user[0].avatar.url : ''
    });

    return res.json(comment);
  }

  async update(req, res) {
    console.log(req);
    const comment = await Comment.findByIdAndUpdate(
      req.body.id,
      {
        comment: req.body.comment,
      },
      { new: true }
    );

    return res.json(comment);
  }

  async delete(req, res) {
    const { id, postId } = req.params;
    const post = await Post.findByPk(postId);
    const comment = await Comment.findOne({_id: id});
        
    if(!post.user_id === req.userId && !comment.user === req.userId){
        return res.status(401).json({ error: 'Not authorization' });
    }
    
    await post.update({comments_quantity: post.comments_quantity - 1});
    await Comment.deleteOne({ _id: id});

    return res.json(201);
  }
}

module.exports = new CommentController();
