const multer = require('multer');
const path = require("path");

let storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    console.log("req>>>", file);
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    // any type of file is supported
    cb(null, true);
  },
}).array('files', 5); // Specify 'files' as the field name and 5 as the maximum number of files

module.exports = upload;
