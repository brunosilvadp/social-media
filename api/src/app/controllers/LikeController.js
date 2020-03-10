const Like = require('../schemas/Like');

class LikeController {
  async index(req, res) {
    const like = await Like.find({
      user: req.userId,
    });

    return res.json(like);
  }

  async store(req, res) {
    const like = await Like.create({
      user: req.userId,
      post: req.body.postId,
    });

    return res.json(like);
  }

  async update(req, res) {
    const like = await Like.findByIdAndUpdate(
      req.params.id,
      {
        liked: req.body.liked,
      },
      { new: true }
    );

    return res.json(like);
  }
}

module.exports = new LikeController();
