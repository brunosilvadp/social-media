const StoreUser = require('./rules/StoreUser');
const Follower = require('../schemas/Follower');
const User = require('../models/User');
const File = require('../models/File');
const Sequelize = require('sequelize');
const mailService = require('../services/Mail');
const crypto = require('crypto');

class UserController {
  
  async store(req, res) {
    if (!(await StoreUser.create(req.body))) {
      return res.json({ error: 'Preencha todos os campos' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.json({ error: 'Já existe um usuário com esse e-mail' });
    }
    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    req.body.verification = verificationToken;
    
    const { id, name, email, provider } = await User.create(req.body);
    
    const mailData = {
      from: `User <${process.env.MAIL_USER}>`,
      to: req.body.email,
      name
    }

    mailService.accountConfirmation(mailData, verificationToken)

    await Follower.create({
      user_following: id,
      user_followed: 1,
    });

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    if (!(await StoreUser.update(req.body))) {
      return res.json({ error: 'Preencha todos os campos' });
    }

    const { email, password, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.json({ error: 'Já existe um usuário com esse e-mail' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.json({ error: 'A senha antiga está incorreta!' });
    }
    
    if(!password){
      delete req.body.password;
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async findByName(req, res){
    
    let follower = await Follower.find({
      user_following: req.userId,
      following: true
    }, {
      user_followed: 1,
      _id: 0
    });

    const Op = Sequelize.Op
    let { name } = req.params;
    const users = await User.findAll({
      where: {
        active: true,
        name: {
          [Op.iLike]: '%' + name + '%'
        },
        id: {
          [Op.ne]: req.userId, 
          // [Op.notIn]: follower.map(follower => {
          //   return follower.user_followed;
          // })
        }
      },
      include: {
        model: File,
        as: "avatar"
      }
    })

    return res.json({
      users,
      follower
    })
  }

  async getProfile(req, res){
    const user = await User.findByPk(req.userId)
    return res.json(user);
  }

  async storeAvatar(req, res){
    const { originalname: name, path } = req.file;
    
    const user = await User.findByPk(req.userId);

    const { id } = await File.create({name, path});
    
    await user.update({file_id: id});

    const users = await User.findAll({
      where: {
        id: req.userId
      }, 
      include: {
        model: File,
        as: "avatar"
      }
    })
    return res.json(users);
  }

  async storeBanner(req, res){
    const { path } = req.file;
    const user = await User.findByPk(req.userId);

    await user.update({banner: path});

    const users = await User.findByPk(req.userId)
    return res.json(users);
  }

  async deactivate(req, res){
    let user = await User.findByPk(req.userId);
    await user.update({active: false});
    
    return res.status(200).json("Conta desativada com sucesso!");
  }

  async activate(req, res){
    const token = req.body.verification;
    const user = await User.findOne({where: {verification_token: token}});
    if(!user.active && !user.email_verified_at){
      await user.update({email_verified_at: new Date().getTime(), active: true})
      return res.sendStatus(200);
    }
    return res.sendStatus(401)
  }
}

module.exports = new UserController();
