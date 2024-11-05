const configSystem = require('../../config/system')

const bookRouter = require('./book.route')
const employeeRouter = require('./employee.route')
const readerRouter = require('../client/reader.route');

    
module.exports = (app) => {
    
    const ADMIN_PATH = '/' + configSystem.adminPrefix

    app.use(
        ADMIN_PATH + '/books',
        bookRouter
    )

    app.use(
        ADMIN_PATH + '/employee',
        employeeRouter
    )

    app.use(
        ADMIN_PATH + '/reader',
        readerRouter
    )

}