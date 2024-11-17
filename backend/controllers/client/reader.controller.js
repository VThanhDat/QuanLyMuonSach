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

const borrowBook = async (req, res) => {
    try {

        const tokenUser = req.cookies.tokenUser;
        if (tokenUser) {
            const reader = await Reader.findOne({ token: tokenUser });

            if (!reader) {
                return res.status(404).json({ message: 'Reader not found' });
            }

            if (!Array.isArray(reader.borrow)) {
                reader.borrow = [];
            }

            const newBorrow = {
                id_book: req.body.borrow.id_book,
                status: req.body.borrow.status || "processing",
                borrowDate: req.body.borrow.borrowDate || "01/01/2024",
                returnDate: req.body.borrow.returnDate || "31/12/2024",
                quantity: req.body.borrow.quantity || 1,
                initialQuantity: req.body.borrow.quantity || 1,
            };

            const readers = await Reader.find({});
            let borrowedBookQuantity = 0;

            readers.forEach(function (reader) {
                reader.borrow.forEach(function (borrow) {
                    if (borrow.id_book === req.body.borrow.id_book) {
                        borrowedBookQuantity += borrow.quantity;
                    }
                });
            });

            const book = await Book.findById(req.body.borrow.id_book);
            if (!book) {
                // Kiểm tra xem sách có tồn tại hay không
                return res.status(404).json({ message: 'Book not found' });
            }


            if (book.quantity === 0) {
                // Không còn sách trong kho
                console.log("Không còn sách trong kho để mượn");
                return res.status(400).json({ message: "Không còn sách trong kho để mượn" });
            } else if (book.quantity - borrowedBookQuantity - newBorrow.quantity < 0) {
                // Số lượng sách đã được mượn bằng hoặc vượt quá số lượng sách trong kho
                console.log("Số lượng sách đã mượn đã đạt tới giới hạn");
                return res.status(400).json({ message: "Số lượng sách đã mượn đã đạt tới giới hạn" });
            }

            // Kiểm tra xem đã có quyển sách trong mảng borrow chưa
            const existingBook = reader.borrow.find(book => book.id_book === newBorrow.id_book);

            if (existingBook) {
                // Nếu đã có quyển sách trong mảng borrow, cập nhật số lượng
                existingBook.quantity += newBorrow.quantity;
                existingBook.borrowDate = newBorrow.borrowDate || '01/01/2024';
                existingBook.returnDate = newBorrow.returnDate || '31/12/2024';
                existingBook.status = newBorrow.status || "processing";
            } else {
                // Nếu chưa có quyển sách trong mảng borrow, thêm borrow vào mảng
                reader.borrow.push(newBorrow);
            }

            // Lưu lại thay đổi vào cơ sở dữ liệu
            await reader.save();

            res.status(200).json({ message: 'Cập nhật mượn sách thành công', reader });
        }
    } catch (error) {
        console.error('Cập nhật mượn sách thất bại:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteBookFromBorrow = asyncHandler(async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        const id = req.params.id;

        if (tokenUser) {
            const reader = await Reader.findOne({
                token: tokenUser,
            })

            if (reader) {
                // Lọc ra các danh sách trong borrow mà id_book không bằng id cần xóa
                reader.borrow = reader.borrow.filter(book => book.id_book !== id)

                // Lưu thay đổi vào CSDL
                await reader.save()
                res.status(200).json({message:"Book deleted successfully."})
            } else {
                res.status(404).json({message: "Reader not found."})
            }
        } else {
            res.status(401).json({message: "Unauthorized."})
        }
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` });
    }
})

const statusBookReturn = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { readerId, bookId } = req.params
        const { status } = req.body

        // Kiểm tra xem reader và book có tồn tại không
        const reader = await Reader.findById(readerId)
        if (!reader) {
            res.status(404).json({ message: "Reader not found." })
            return;
        }

        const bookIndex = reader.borrow.findIndex(book => book.id_book === bookId)
        if (bookIndex === -1) {
            res.status(404).json({ message: "Book not found." })
            return;
        }

        console.log("bookIndex", bookIndex)

        // Thay đổi trạng thái sách
        reader.borrow[bookIndex].status = status

        // Nếu trạng thái là "đã trả", giảm quantity đi 1
        if (status === "returned") {
            // Giảm quantity đi 1, nhưng không thay đổi initialQuantity
            reader.borrow[bookIndex].quantity -= 1;
        }

        // Lưu thay đổi vào CSDL
        await reader.save()

        // Trả về thông báo thành công
        res.status(200).json({ message: "Status updated successfully." })
    } catch (error) {
        res.status(500).json({ message: `Error! ${error}` })
    }
}


const getNumberBookBorrowed = asyncHandler(async (req,res) => {
    try {
        const readers = await Reader.find({})
        let borrowedBookQuantity = 0

        readers.forEach(function (reader) {
            reader.borrow.forEach(function (borrow) {
                if (borrow.id_book === req.params.id_book) {
                    borrowedBookQuantity += borrow.quantity
                }
            })
        })

        res.status(200).json({message: 'Send NumberBookBorrowed successfully',borrowedBookQuantity})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = {
    create,
    getUser,
    getAll,
    deleteBookFromBorrow,
    borrowBook,
    statusBookReturn,
    getNumberBookBorrowed,
}
