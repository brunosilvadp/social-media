const Post = require('../models/Post');
const Timeline = require('../schemas/Timeline');
const User = require('../models/User');
const Comment = require('../schemas/Comment');
const File = require('../models/File');
const Follower = require('../schemas/Follower');
const notificationController = require('../controllers/NotificationController');
class PostController {

  async index(req, res){
    let follower = [];
    let usersID = [];
    if(req.userId !== 1){
      follower = await Follower.find({
        user_following: req.userId,
        following: true
      }, {
        user_followed: 1,
        _id: 0
      });

      usersID = follower.map(follower => {
        return follower.user_followed;
      })

      usersID.push(req.userId);
    }
    
    let posts = await Post.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: req.userId !== 1 ? {
        user_id: usersID
      } : null,
      include: {
        model: User,
        where: {
          active: true
        },
        include: {
          model: File,
          as: "avatar"
        }
      },
      limit: 10,
      offset: req.params.offset
    })

    let randomPosts = [];
    
    let quantityPosts = 0 ;
    //Execute only in first query
    if(parseInt(req.params.offset) === 0) {
      
      quantityPosts = await Post.count({
        where: (req.userId !== 1) ? {
          user_id: usersID
        } : null,
        include: {
          model: User,
          where: {
            active: true
          }
        },
      });

      if(req.userId !== 1){
        
        //Select max id in db for generate random ids
        const maxID = await User.findOne({
          attributes: ['id'],
          order: [['id', 'DESC']]
        })
        let randomIds = [];
      
        for(; randomIds.length < Math.abs(usersID.length - maxID.id) && randomIds.length < 15 ;){
          if(randomIds.length < maxID.id){
            const number = Math.floor(Math.random() * (maxID.id)) + 1;
            
            //Validation for don't generate duplicate ids
            if(!randomIds.includes(number) && !usersID.includes(number)) randomIds.push(number)
          }
        }

        //Return posts by random users 
        randomPosts = await Post.findAll({
          order: [
            ['id', 'DESC']
          ],
          where: {
            user_id: randomIds
          },
          include: {
            model: User,
            where: {
              active: true
            },
            include: {
              model: File,
              as: "avatar"
            }
          }
        })
      }
    }
    
    return res.json({posts, quantityPosts, randomPosts});
  }

  async update(req, res){
    const post = await Post.findByPk(req.body.id);
    await post.update({subtitle: req.body.content})
    return res.json(post);
  }

  async store(req, res) {
    let name, path = null;
    if(req.file){
      name =  req.file.originalname;
      path = req.file.path
    }
    const user_id = req.userId;
    const { subtitle } = req.body;
    let post = await Post.create({ subtitle, name, path, user_id });
    
    // await Timeline.create({
    //   user: req.userId,
    //   type: 'posts',
    //   item: post.id,
    //   activity: 'create',
    // });

    post = await Post.findOne({
      where: {
        id: post.id
      },
      include: [{
        model: User,
        attributes: ['name'],
        include: {
          model: File,
          as: "avatar"
        }
      }]
    })

    await notificationController.store({
      notification: post.User.name + " fez uma nova postagem",
      type: 'post',
      user: req.userId,
      content_id: post.id,
      checked: false
    })

    return res.json(post);
  }

  async findOneByPk(req, res){
    const { id } = req.params;
    const post = await Post.findAll({
     where: {
        id
      },
      include: {
        model: User,
        include: {
          model: File,
          as: "avatar"
        }
      }
    })

    const comments = await Comment.find({
      post: id,
    }).sort({
      createdAt: -1
    });

    return res.json({post, comments});
  }

  async delete(req, res) {
    const { id } = req.params;

    const post = await Post.findByPk(id);

    if (post.user_id !== req.userId) {
      return res.status(401).json({ error: 'Not authorization' });
    }

    await Post.destroy({ where: { id: [id] }, truncate: { cascade: true } });
    await Comment.deleteMany({ post: id});
    await Timeline.deleteOne({item: id});
    return res.json(201);
  }
}

module.exports = new PostController();
