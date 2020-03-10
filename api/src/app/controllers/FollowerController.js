const Follower = require('../schemas/Follower');
const User = require('../models/User');
const File = require('../models/File');
class FollowerController {
  async index(req, res) {
    let follower = await Follower.find({
      user_following: req.userId,
      following: true
    }, {
      user_followed: 1,
      _id: 0
    });
    
    if(follower.length > 0){
      follower = await User.findAll({
        order: [['id', 'asc']],
        where: {
          active: true,
          id: follower.map(follower => {
            return follower.user_followed;
          })
        },
        include: [
          {
            model: File,
            as: 'avatar'
          }
        ]
      })
    }
    
    const friendQuantity =  await Follower.aggregate([
      {
        $match: {
          "user_following": { $in: follower.map(follower => follower.id)},
          following: true
        },
    }, {
      $group:{
      _id: "$user_following",
      count: { $sum: 1 }
    }}]).sort({
      "user_following": -1
    })

    return res.json({follower, friendQuantity});
  }

  async store(req, res) {
    let follower = await Follower.findOne({
      user_following: req.userId,
      user_followed: req.body.user_followed
    });
    
    if(!follower){
      follower = await Follower.create({
        user_following: req.userId,
        user_followed: req.body.user_followed,
      });
    }else{
      follower = await Follower.findOneAndUpdate(
        {
          user_following: req.userId,
          user_followed: req.body.user_followed
        },
        {
          following: true,
        },
        { new: true }
      )
    }

    return res.json(follower);
  }

  async unfollow(req, res){
    
    if(parseInt(req.body.user_followed) !== 1){
      const follower = await Follower.findOneAndUpdate(
        {
          user_following: req.userId,
          user_followed: req.body.user_followed
        },
        {
          following: false,
        },
        { new: true }
      )
      return res.json(follower); 
    }
    return res.status(401)
  }

  async update(req, res) {
    const follower = await Follower.findByIdAndUpdate(
      req.params.id,
      {
        following: req.body.following,
      },
      { new: true }
    );

    return res.json(follower);
  }
}

module.exports = new FollowerController();
