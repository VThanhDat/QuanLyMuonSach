<template>
    <div>
        <ClientAppHeader />
        <div class="container mt-3">
            <h3 class="name"><b>Danh Sách Sách Đã Mượn</b></h3>
            <template v-if="reader.borrow && reader.borrow.length > 0">
                <table class="table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <!-- <th>Ảnh sách</th> -->
                            <th>Tên sách</th>
                            <th>Số lượng</th>
                            <th>Ngày mượn</th>
                            <th>Ngày trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(borrowedBook, index) in reader.borrow" :key="borrowedBook._id">
                            <td>{{ index + 1 }}</td>
                            <!-- <td>
                  <img
                    :src="getBookImage(borrowedBook.id_book)"
                    alt="Book image"
                    width="100"
                  />
                </td> -->
                            <td>{{ getBookName(borrowedBook.id_book) }}</td>
                            <td>{{ borrowedBook.quantity }}</td>
                            <td>{{ borrowedBook.borrowDate }}</td>
                            <td>{{ borrowedBook.returnDate }}</td>
                            <td class="text-primary">
                                {{ borrowedBook.status === 'accepted' ? 'Đã duyệt' : borrowedBook.status === 'refused' ?
                                    'Từ chối' :
                                    borrowedBook.status === 'returned' ? 'Đã trả' : borrowedBook.status === 'processing' ?
                                        'Chờ xử lí' :
                                        'Unknown' }}
                            </td>
                            <td>
                                <button v-if="canReturn(borrowedBook.status)" class="btn btn-danger"
                                    @click="statusBookReturn(reader, borrowedBook, 'returned')">
                                    Trả sách
                                </button>
                                <button disabled v-if="canDelete(borrowedBook.status)" class="btn btn-danger">
                                    Đả trả
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
            <template v-else>
                <p><i>Bạn chưa có đăng ký đơn mượn nào.</i></p>
            </template>
        </div>
    </div>
</template>

<script>
import ClientBookDetail from "@/components/client/ClientBookDetail.vue";
import ClientAppHeader from "@/components/client/ClientAppHeader.vue";
import ClientInputSearch from "@/components/client/ClientInputSearch.vue";
import ClientBookList from "@/components/client/ClientBookList.vue";
import BookService from "@/services/client/book.service";
import readerService from "@/services/client/reader.service";
import Cookies from 'js-cookie';

export default {
    components: {
        ClientBookDetail,
        ClientInputSearch,
        ClientBookList,
        ClientAppHeader,
    },
    // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới
    data() {
        return {
            books: [],
            activeIndex: -1,
            searchText: "",
            token: "",
            reader: {},
        };
    },
    watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        // Chuyển các đối tượng book thành chuỗi để tiện cho tìm kiếm.
        booksStrings() {
            return this.books.map((book) => {
                const {
                    bookTitle,
                    price,
                    quantity,
                    publishYear,
                    author,
                    thumbnail,
                } = book;
                return [
                    bookTitle,
                    price,
                    quantity,
                    publishYear,
                    author,
                    thumbnail,
                ].join("");
            });
        },
        // Trả về các book có chứa thông tin cần tìm kiếm.
        filteredBooks() {
            if (!this.searchText) return this.books;

            return this.books.filter((_book, index) =>
                this.booksStrings[index].includes(this.searchText)
            );
        },
        activeBook() {
            if (this.activeIndex < 0) return null;
            return this.filteredBooks[this.activeIndex];
        },
        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveReaders() {
            try {
                const token = Cookies.get('tokenUser');
                this.token = token;
                let formData = new FormData();
                formData.append("tokenUser", token);
                // Lấy danh sách borrows từ readerService
                this.reader = await readerService.getUserByToken(formData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin độc giả:', error);
                // Có thể hiển thị thông báo lỗi trên UI nếu cần
            }
        },
        async statusBookReturn(reader, borrowedBook, status) {
            try {
                const response = await readerService.statusBookReturn(
                    reader._id,
                    borrowedBook.id_book,
                    status
                );
                // Refresh data after changing status
                await this.retrieveReaders();
                await this.retrieveBooks();
            } catch (error) {
                console.log(error);
            }
        },

        getBookName(bookId) {
            const book = this.books.find((book) => book._id === bookId);
            return book ? book.bookTitle : "Unknown";
        },
        canDelete(status) {
            return status === "processing" || status === "refused" || status === "returned";
        },
        canReturn(status) {
            return status === "accepted";
        },
        // async deleteBook(id) {
        //     const respone = await readerService.returnBookBorrow(id);
        //     this.retrieveBooks();
        //     this.retrieveReaders();
        // },
        refreshList() {
            this.retrieveBooks();
            this.searchText = "";
            this.activeIndex = -1;
        },
    },
    mounted() {
        this.retrieveBooks();
        this.retrieveReaders();
        this.refreshList();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
}

.custom-margin {
    margin-right: 10px;
}

.name {
    text-align: center;
    color: red;
    font-style: italic;
    margin-bottom: 10px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;

}

th {
    background-color: #c5c3c3;
    color: black;
}

tr:hover {
    background-color: #f2f2f2;
}

td button {
    margin-right: 5px;
}

td:nth-child(2) {
    /*nth-child để chọn cột thứ 2 (tính từ 1) */
    text-align: left;
    width: 30%;
}

td:nth-child(3) {
    width: 7%;
}
</style>