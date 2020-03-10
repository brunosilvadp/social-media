const Notification = require('../schemas/Notification');
const Follower = require('../schemas/Follower');

class NotificationController{

    async index(req, res){
        const followers = await Follower.find({
            user_following: req.userId, 
            following: true
        })
        
        const notification = await Notification.find(
            {
                $or: [
                    (followers.length)
                    ?
                        {
                            user: { $in: followers.map(follower => follower.user_followed)},
                            type: {$ne: "message"},
                            user: {$ne: req.userId}
                        }
                    :
                        {
                            user: req.userId, type: "message"               
                        }
                    ,
                    {user: req.userId, type: "message"}
                ]
                
            }
        ).sort({
            createdAt: -1
        }).limit(10).skip(parseInt(req.params.offset))
        const quantityRegisters = req.params.offset !== 0 ? await Notification.count(
            {
                $or: [
                    {
                        user: { $in: followers.map(follower => follower.user_followed)},
                        type: {$ne: "message"},
                        user: {$ne: req.userId}
                    },
                    {user: req.userId, type: "message"}
                ]
                
            }
        ) : 0;

        return res.json({notification, quantityRegisters});
    }

    async store(data){
        Notification.create(data)

        return 201;
    }

    async getQuantityNotificationsUnchecked(req, res){
        const followers = await Follower.find({
            user_following: req.userId,
            following: true
        })
        const notification = await Notification.aggregate([
            {
                $match: {
                    checked: false,
                    $or: [
                        (followers.length)
                        ?
                            {
                                user: { $in: followers.map(follower => follower.user_followed)},
                                type: {$ne: "message"},
                                user: {$ne: req.userId}
                            }
                        :
                            {
                                user: req.userId, type: "message"               
                            }
                        ,
                        {user: req.userId, type: "message"}
                    ]
                }
            },
            {
                $group: {
                    _id: "$checked",
                    quantity_notifications: { $sum: 1 } 
                }
            }
        ])

        return res.json(notification);
    }

    async update(req, res){
        await Notification.findOneAndUpdate( {
            _id: req.body.id,
          },
          {
            checked: true,
          },
          { new: true })

        return res.status(204)
    }

}

module.exports = new NotificationController();