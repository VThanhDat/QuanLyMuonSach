const Reader = require('../../models/reader.model')
const Book = require('../../models/book.model')
const asyncHandler = require('express-async-handler')
const generateString = require('../../helpers/generateString')

const create = asyncHandler(async (req, res) => {
    req.body.token = generateString.generateRandomString(20);
    const user = await Reader.create(req.body);
    res.status(200).json(user);
})

const getUser = asyncHandler(async (req, res) => {
    try {
        // Kiểm tra xem header Authorization có tồn tại hay không
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Authorization token missing or malformed" });
        }

        // Tách token từ header Authorization
        const tokenUser = req.headers.authorization.split(" ")[1];
        
        // Tìm người dùng với token
        const reader = await Reader.findOne({ token: tokenUser });

        if (!reader) {
            return res.status(404).json({ message: "Reader not found" });
        }

        res.status(200).json({ message: "Send reader successfully.", reader });
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` });
    }
});


const getAll = async (req, res) => {
    try {
        const reader = await Reader.find({});
        res.status(200).json(reader);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    create,
    getUser,
    getAll
}
