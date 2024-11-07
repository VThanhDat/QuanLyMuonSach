<template>
    <div class="form">
        <form @submit.prevent="onSubmit">
            <div class="form-item">
                <label class="label" for="bookTitle">Tên sách:</label><br />
                <input class="input" type="text" id="bookTitle" v-model="formData.bookTitle" />
            </div>

            <div class="form-item">
                <label class="label" for="price">Giá:</label><br />
                <input class="input" type="number" id="price" v-model="formData.price" />
            </div>

            <div class="form-item">
                <label class="label" for="price">Số lượng:</label><br />
                <input class="input" type="number" id="quantity" v-model="formData.quantity" />
            </div>

            <div class="form-item">
                <label class="label" for="quantity">Ngày mượn:</label><br />
                <input class="input" type="date" id="borrowDate" v-model="formData.borrowDate" />
            </div>

            <div class="form-item">
                <label class="label" for="quantity">Ngày trả:</label><br />
                <input class="input" type="date" id="returnDate" v-model="formData.returnDate" />
            </div>
            <button type="submit" class="btn btn-primary">Mượn Sách</button>
        </form>
    </div>
</template>

<script>
import BookService from "@/services/client/book.service";
import readerService from "@/services/client/reader.service";
import Cookies from 'js-cookie';

export default {
    props: ["bookId"],
    data() {
        return {
            formData: {
                id_book: this.bookId,
                bookTitle: "",
                price: 0,
                quantity: 1,
                borrowDate: "",
                returnDate: "",
            },
            token: Cookies.get('tokenUser'),
        };
    },
    mounted() {
        this.retrieve(this.bookId);
    },
    methods: {
        async retrieve(bookId) {
            try {
                const book = await BookService.get(bookId);
                if (book) {
                    this.formData.bookTitle = book.bookTitle;
                    this.formData.price = book.price;
                    this.formData.id_book = bookId;
                } else {
                    console.log("Book not found");
                }
            } catch (error) {
                console.log(error);
            }
        },

        async updateBook() {
            try {
                const book = await BookService.get(this.formData.id_book);
                if (this.formData.quantity > book.quantity) {
                    alert('Số lượng bạn mượn vượt quá số lượng sách còn lại.');
                    return;
                }
                
                const response = await readerService.updateBorrow(this.token, this.formData);
                console.log("Borrow response:", response);
            } catch (error) {
                console.log(error);
            }
        },

        onSubmit() {
            this.updateBook()
                .then(() => {
                    this.$emit('borrow-success'); // Phát ra sự kiện để component cha xử lý
                })
                .catch((error) => {
                    console.error('Error while borrowing book:', error);
                });
        },
    },
};
</script>
<style scoped>
.form-item {
    text-align: left;
    padding: 10px;
}

.label {
    font-weight: bold;
}

.input {
    width: 100%;
    /* height: 40px; */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn-primary{
    margin-top: 20px;
    background-color: #a3a09b;
    border: #a3a09b;
}

.btn-primary:hover{
    background-color: #6f6e6d;
}
</style>