const bookRoutes = require('./book.route')
const readerRoutes = require('./reader.route')

const controllerReader = require('../../controllers/client/reader.controller')

    
module.exports = (app) => {
    app.use("/books", bookRoutes),
    app.post('/reader/register',controllerReader.create)
    app.use("/reader", readerRoutes)
}