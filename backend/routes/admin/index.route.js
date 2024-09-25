const configSystem = require('../../config/system')

const bookRouter = require('./book.route')
const employeeRouter = require('./employee.route')

    
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

}