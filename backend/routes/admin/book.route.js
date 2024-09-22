const express = require("express")
const router = express.Router()
const controller = require('../../controllers/admin/book.controller')

const multer = require("multer") // dùng để upload ảnh, ...

const storageMulterHelper = require('../../helpers/storageMulter')
const storage = storageMulterHelper();

const upload = multer({ storage: storage })

router.post('/', upload.single('thumbnail'), controller.createBook)

module.exports = router;