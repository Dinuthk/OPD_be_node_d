const multer = require('multer');
const path = require("path");

let storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    cb(null, true);
    // if (
    //   file.mimetype !== 'image/png'
    //   && file.mimetype !== 'image/gif'
    //   && file.mimetype !== 'image/jpeg'
    //   && file.mimetype !== 'image/svg'
    // ) {
    //   return cb('This file type is not supported', false);
    // } else {
    //   cb(null, true);
    // }
  },
});

module.exports = upload;