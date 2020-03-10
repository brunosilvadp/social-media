const ftpStorage = require('multer-ftp');

module.exports =  {
  storage: new ftpStorage({
    basepath: './',
    ftp: {
      host: process.env.HOST_FTP,
      secure: false,
      user: process.env.USER_FTP,
      password: process.env.PASSWORD_FTP
    }
  }),
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ]
    if(allowedMimes.includes(file.mimetype)){
      cb(null, true)
    }else{
      cb(new Error("Invalid file type"));
    }
  }
};


// multer.diskStorage({
//   destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
//   fileName: (req, avatar, cb) => {
//     crypto.randomBytes(20, (err, res) => {
//       if (err) return cb(err);

//       return cb(null, res.toString('hex') + extname(avatar.originalname));
//     });
//   },
// })