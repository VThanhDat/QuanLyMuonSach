const Book = require('../../models/book.model')
const ApiError = require('../../helpers/api-error')
const asyncHandler = require('express-async-handler')
const fs = require('fs')
const upload = require('../../middlewares/admin/upload')
const path = require('path')
const fsx = require('fs-extra')

const createBook = async (req, res) => {
    try {
        const book = await Book.create({
            ...req.body,
            thumbnail: req.file ? req.file.filename : null
        })
        res.status(200).json({ message: 'Book added successfully', book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createBook,
}