const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');
const AlbumController = require('./app/controllers/AlbumController');
const AlbumItemController = require('./app/controllers/AlbumItemController');
const CommentController = require('./app/controllers/CommentController');
const FollowerController = require('./app/controllers/FollowerController');
const LikeController = require('./app/controllers/LikeController');
const MessageController = require('./app/controllers/MessageController');
const PostController = require('./app/controllers/PostController');
const SessionController = require('./app/controllers/SessionController');
const NotificationController = require('./app/controllers/NotificationController');
const AdminController = require('./app/controllers/AdminController');
const UserController = require('./app/controllers/UserController');
const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store );
routes.post('/users', UserController.store );

routes.post('/users', UserController.store );

routes.put('/users/activate', UserController.activate );


routes.get('/admin/users/listing', AdminController.index );
routes.get('/admin/users/delete/:id', AdminController.delete );
routes.get('/admin/users/show/:id', AdminController.show);

routes.use(authMiddleware);
routes.get('/authenticated', SessionController.index );

routes.get('/users/find/:name', UserController.findByName );

routes.get('/albuns', AlbumController.index );
routes.post('/albuns',AlbumController.store );
routes.delete('/albuns/:id', AlbumController.delete );

routes.get('/albunsItems/:id', AlbumItemController.findByAlbumId );
routes.post('/albunsItems', upload.single('avatar'), AlbumItemController.store );
routes.delete('/albunsItems/:id', AlbumItemController.delete );

routes.get('/comments/:id', CommentController.index );
routes.post('/comments', CommentController.store );
routes.put('/comments', CommentController.update );
routes.delete('/comments/:postId/:id', CommentController.delete );

routes.get('/followers', FollowerController.index );
routes.post('/followers', FollowerController.store );
// routes.put('/followers', FollowerController.update );
routes.put('/followers', FollowerController.unfollow );

routes.get('/likes', LikeController.index );
routes.post('/likes', LikeController.store );
routes.put('/likes', LikeController.update );

routes.get('/messages/:id*?', MessageController.index );
routes.get('/list-messages/:id', MessageController.loadMessages );
routes.post('/messages', MessageController.store );
routes.put('/messages', MessageController.update );

routes.post('/posts', upload.single('avatar'), PostController.store);
routes.get('/posts/:offset', PostController.index);
routes.get('/show/posts/:id', PostController.findOneByPk);
routes.put('/posts', PostController.update);
routes.delete('/posts/:id', PostController.delete);

routes.put('/user/avatar', upload.single('avatar'), UserController.storeAvatar );
routes.put('/user/banner', upload.single('banner'), UserController.storeBanner );
routes.put('/user/deactivate', UserController.deactivate );

routes.put('/users', UserController.update );

routes.get('/update-profile', UserController.getProfile );

routes.get('/notifications/:offset*?', NotificationController.index)
routes.post('/notifications', NotificationController.store)
routes.put('/notifications', NotificationController.update)
routes.get('/quantity-notifications', NotificationController.getQuantityNotificationsUnchecked)

module.exports = routes;
