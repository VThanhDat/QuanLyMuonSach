const express = require("express")
const router = express.Router()
const controller = require('../../controllers/client/reader.controller')

router.get('/', controller.getAll)
router.get('/user', controller.getUser)
router.put('/borrow', controller.borrowBook)
router.put('/statusBookReturn/:readerId/:bookId', controller.statusBookReturn)
router.delete('/return/:id', controller.deleteBookFromBorrow)
router.get('/numberbookborrowed/:id_book',controller.getNumberBookBorrowed)
module.exports = router;