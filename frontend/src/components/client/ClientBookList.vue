<template>
    <div class="book-grid">
      <div class="book" v-for="(book, index) in books" :key="book._id" :class="{ active: index === activeIndex }"
        @click="updateActiveIndex(index)">
        <img :src="'/api/uploads/' + book.thumbnail" alt="Book Image" />
        <div class="book-details">
          <p class="book-title">{{ truncate(book.bookTitle) }}</p>
          <p class="author">{{ book.author }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      books: { type: Array, default: [] },
      activeIndex: { type: Number, default: -1 },
    },
    emits: ["update:activeIndex"],
    methods: {
      updateActiveIndex(index) {
        this.$emit("update:activeIndex", index);
      },
      truncate(text, length = 20) {
        if (text.length > length) {
          return text.substring(0, length) + '...';
        }
        return text;
      },
    }
  };
  </script>
  
  <style>
  .book-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; 
  }
  
  .book {
    flex-basis: 18%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #9a9999;
    border-radius: 5px;
    margin: 1%;
  }
  
  .book img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    /* border: 1px solid #ccc; */
    border-radius: 5px;
  }
  
  .book-details {
    text-align: center;
  }
  
  .book-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .author {
    margin-top: 5px;
  }
  </style>
  