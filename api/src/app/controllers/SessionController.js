const jwt = require('jsonwebtoken');
const StoreSession = require('./rules/StoreSession');
const User = require('../models/User');
const File = require('../models/File');
const authConfig = require('../../config/auth');

class SessionController {
  
  async index(req, res){
    return res.send(true);
  }

  async store(req, res) {
    if (!(await StoreSession.create(req.body))) {
      return res.json({ error: 'Informe o seu e-mail e sua senha!' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } , include: {model: File, as: 'avatar' }});

    if (!user || !(await user.checkPassword(password))) {
      return res.json({ error: 'OPS! Os dados informados estão incorretos. Tente novamente!' });
    }

    if(!user.active && !user.email_verified_at || !user.email_verified_at){
      return res.json({ error: 'Sua conta não está verificada. Confira seu e-mail e ative sua conta para efetuar o login!' });
    }

    if(!user.active) await user.update({active: true});

    const { id, name, avatar, url } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        url
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
