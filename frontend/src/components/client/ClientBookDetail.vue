<template>
    <div>
      <hr />
      <div class="p-1">
        <strong>Tên sách:</strong>
        {{ book.bookTitle }}
      </div>
      <div class="p-1">
        <img class="center-image" width="150px" height="200px" :src="'/api/uploads/' + book.thumbnail" alt="Hình sách"
          style="max-width: 100%;" />
      </div>
      <div class="p-1">
        <strong>Giá: </strong>
        {{ book.price }}
      </div>
      <div class="p-1">
        <strong>Số lượng trong kho: </strong>
        {{ book.quantity }}
      </div>
      <div class="p-1">
        <strong>Số lượng còn lại: </strong>
        {{ remain }}
      </div>
      <div class="p-1">
        <strong>Tác giả:</strong>
        {{ book.author }}
      </div>
      <hr />
      <div class="p-1">
        <strong>Tên nhà xuất bản:</strong>
        {{ book.publisherName }}
      </div>
      <div class="p-1">
        <strong>Năm xuất bản:</strong>
        {{ book.publishYear }}
      </div>
    </div>
  </template>
  
  <script>  
  export default {
    props: {
      book: { type: Object, required: true },
    },
    data() {
      return {
        formData: {
          quantity: 1,
          borrowDate: "",
          returnDate: "",
          book_id: this.book._id,
        },
        remain: 0,
      };
    },
    methods: {
      
    },
    watch: {
      // Giám sát sự thay đổi của prop 'book'
      book: {
        handler() {
       
        },
        deep: true, // Giám sát sâu vào các thuộc tính của 'book'
      },
    },
    mounted() {
    },
  };
  </script>
  
  <style>
  .center-image {
    display: block;
    margin: 0 auto;
  }
  </style>