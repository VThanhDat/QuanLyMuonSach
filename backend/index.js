const express = require('express')
require('dotenv').config()

// Kết nối CSDL
const database = require('./config/database');
database.connect();

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', (req, res) => { res.send('SEVER ON') })

app.listen(port, () => {
    console.log('Server running on the port: '+ port)
})