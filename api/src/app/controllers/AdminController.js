const User = require('../models/User')
const adminMiddlewares = require('../middlewares/admin')
class AdminController{
    
    async index(req, res){
        if(!await adminMiddlewares(req)) return res.status(401).json({ message: 'Token invalid' });
        
        return res.json(await User.findAll())
    }

    async delete(req, res){
        if(!await adminMiddlewares(req)) return res.status(401).json({ message: 'Token invalid' });
        
        await User.destroy({where: {id: req.params.id}, truncate: {cascade: true}});
        
        return res.json(201)
    }

    async show(req, res){
        if(!await adminMiddlewares(req)) return res.status(401).json({ message: 'Token invalid' });
        console.log(req)
        return res.json(await User.findByPk(req.params.id))
    }
}

module.exports = new AdminController();