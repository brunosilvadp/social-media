const Timeline = require('../schemas/Timeline');

class TimelineController {
  async index(req, res) {
    const timelines = await Timeline.find({
      user: req.userId,
    });

    return res.json(timelines);
  }

  async store(req, res) {
    const { name } = req.body;
    const user_id = req.userId;

    const album = await Timeline.create({ name, user_id });

    return res.json(album);
  }
}

module.exports = new TimelineController();
