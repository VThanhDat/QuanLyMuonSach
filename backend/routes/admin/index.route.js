const configSystem = require('../../config/system')

const bookRouter = require('./book.route')
    
module.exports = (app) => {
    
    const ADMIN_PATH = '/' + configSystem.adminPrefix

    app.use(
        ADMIN_PATH + '/books',
        bookRouter
    )

}