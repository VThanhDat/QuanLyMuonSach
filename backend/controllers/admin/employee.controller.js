const Employee = require('../../models/employee.model')
const Reader = require('../../models/reader.model')

// [GET] /admin/employee/infor
const getInfor = async (req, res) => {
    try {
        const token = req.cookies.token;
        const employee = await Employee.findOne({
            token: token,
        })
        if (!employee) {
            res.status(404).json({message: 'Employee not found.'})
        }
        res.status(200).json({message: 'Send employee successfully', employee})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const getReaders = async (req, res) => {
    try {
        const readers = await Reader.find({})
        res.status(200).json({message: 'Send readers successfully', readers});
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const statusBook = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { readerId, bookId } = req.params
        const { status } = req.body
        // Kiễm tra xem reader và book có tồn tại không
        const reader = await Reader.findById(readerId);
        if (!reader) {
            res.status(404).json({ message: 'Reader not found.' })
            return;
        }
        // findIndex => trả về chỉ số của phần tử đầu tiên thỏa mãn hàm kiểm tra được cung cấp.
        const bookIndex = reader.borrow.findIndex(book => book.id_book === bookId);
        if (bookIndex === -1) {
            res.status(404).json({ message: 'Book not found.' })
            return;
        }
        console.log("bookIndex", bookIndex)
        // Thay đổi trạng thái sách
        reader.borrow[bookIndex].status = status;

        // Lưu thay đổi vào CSDL
        await reader.save();
        res.status(200).json({ message: "Status updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    getInfor,
    getReaders,
    statusBook
}