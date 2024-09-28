const express = require("express")
const router = express.Router()
const controller = require('../../controllers/client/reader.controller')

router.get('/', controller.getAll)
router.get('/user', controller.getUser)

module.exports = router;