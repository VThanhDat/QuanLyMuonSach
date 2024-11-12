// Import các route và controller cần thiết
const bookRoutes = require('./book.route');
const readerRoutes = require('./reader.route');
const authRoutes = require('./auth.route'); // Import authRoutes
const authMiddleware = require("../../middlewares/client/auth.middleware");
const controllerReader = require('../../controllers/client/reader.controller'); // Controller của reader

module.exports = (app) => {
    // Cấu hình các route
    app.use("/books", authMiddleware.authRequire,bookRoutes);          // Dùng cho route /books
    app.use("/reader", authMiddleware.authRequire,readerRoutes);       // Dùng cho route /reader
    app.post("/reader/register", controllerReader.create); // Đảm bảo register được xử lý trước /reader
    app.use("/auth", authRoutes);           // Dùng cho route /auth
};
