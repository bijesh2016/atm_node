const multer = require('multer')
const fs = require('fs');

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = './public'

    if(!fs.existsSync(path)) {
      fs.mkdirSync(path, {recursive: true})
    }

    cb(null, path)
  },
  filename: (req, file, cb) => {
     let fileName = Date.now()+"_"+file.originalname
     cb(null, fileName)
  }
})

const uploader = (filetype = 'image') => {
  let allowExts = ['jpg','jpeg','png','bmp','webp','svg','gif'];
  let limit = 8 * 1024 * 1024;

  if(filetype === 'doc') {
    allowExts = ["doc",'docx','csv','xlsx','pdf','json'];
  } else if(filetype === 'audio') {
    allowExts = ['mp3']
    limit = 5 * 1024 * 1024;
  } else if(filetype === 'video') {
    allowExts = ['mp4','mkv','mov']
    limit = 50 * 1024 * 1024;
  }

  const validateFileType = (req, file, cb) => {
    let exts = file.originalname.split(".").pop()
    if(allowExts.includes(exts.toLowerCase())) {
      cb(false, true)
    } else {
      cb({
        code: 422, 
        message:"Invalid File format",
        status: "INVALID_FILE_TYPE"
      })
    }
  }

  return multer({
    storage: myStorage,
    fileFilter: validateFileType,
    limits: {
      fileSize: limit
    },
  });
}

module.exports = uploader