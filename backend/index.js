const express = require('express')
const path = require('path')
const cors = require('cors')
const moment = require('moment')

require('dotenv').config()

// Kết nối CSDL
const database = require('./config/database')
database.connect();

const adminRoute = require('./routes/admin/index.route')
const clientRoute = require('./routes/client/index.route')

const systemPrefix = require('./config/system')

const app = express()
const port = process.env.PORT

// Cho phép CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Variables
app.locals.adminPrefix = systemPrefix.adminPrefix
app.locals.moment = moment

// Routes
adminRoute(app)
clientRoute(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})