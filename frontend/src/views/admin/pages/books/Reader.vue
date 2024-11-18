<template>
    <div>
        <AppHeader />
        <div class="container mt-3">
            <div class="page row">
                <div class="col-md-10">
                    <InputSearch v-model="searchText" />
                </div>
                <div class="mt-3 col-8">
                    <h4>Danh Sách Độc Giả
                        <i class="fa-solid fa-user"></i>
                    </h4>
                    <div class="item">
                        <button class="btn btn-sm btn-primary custom-margin" @click="refreshList()">
                            <i class="fas fa-redo"></i> Làm mới
                        </button>
                    </div>
                    <ReaderList 
                        v-if="filteredReadersCount > 0" 
                        :readers="paginatedReaders" 
                        v-model:activeIndex="activeIndex" 
                    />
                    <p v-else>Không có độc giả nào.</p>

                    <!-- Phân trang -->
                    <div class="pagination-container mt-4 mb-5">
                        <button 
                            class="btn btn-outline-secondary" 
                            :disabled="currentPage === 1" 
                            @click="goToPage(currentPage - 1)"
                        >
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="mx-2">Trang {{ currentPage }} / {{ totalPages }}</span>
                        <button 
                            class="btn btn-outline-secondary" 
                            :disabled="currentPage === totalPages" 
                            @click="goToPage(currentPage + 1)"
                        >
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-3 col-4">
                    <div v-if="activeReader">
                        <h4>Chi tiết Độc Giả
                            <i class="fa-solid fa-user"></i>
                        </h4>
                        <ReaderDetail :reader="activeReader" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/admin/AppHeader.vue';
import InputSearch from '@/components/admin/InputSearch.vue';
import ReaderList from '@/components/admin/ReaderList.vue';
import ReaderDetail from '@/components/admin/ReaderDetail.vue';
import ReaderService from "@/services/admin/reader.service";

export default {
    components: {
        ReaderDetail,
        InputSearch,
        ReaderList,
        AppHeader,
    },
    data() {
        return {
            readers: [],
            activeIndex: -1,
            searchText: "",
            currentPage: 1,
            pageSize: 3, // Số độc giả trên mỗi trang
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
            this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
        },
    },
    computed: {
        readersStrings() {
            return this.readers.map((reader) => {
                const { 
                    fullName, 
                    email, 
                    phone, 
                    address 
                } = reader;
                return [
                    fullName, 
                    email, 
                    phone, 
                    address
                ].join("");
            });
        },
        filteredReaders() {
            if (!this.searchText) return this.readers;

            return this.readers.filter((_reader, index) =>
                this.readersStrings[index].includes(this.searchText)
            );
        },
        paginatedReaders() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.filteredReaders.slice(startIndex, endIndex);
        },
        activeReader() {
            if (this.activeIndex < 0) return null;
            return this.filteredReaders[this.activeIndex];
        },
        filteredReadersCount() {
            return this.filteredReaders.length;
        },
        totalPages() {
            return Math.ceil(this.filteredReadersCount / this.pageSize);
        },
    },
    methods: {
        async retrieveReaders() {
            try {
                this.readers = await ReaderService.getAllUsers();
            } catch (error) {
                console.log(error);
            }
        },
        refreshList() {
            this.retrieveReaders();
            this.searchText = "";
            this.activeIndex = -1;
            this.currentPage = 1;
        },
        goToPage(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber;
            }
        },
    },
    mounted() {
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

.item {
    padding-bottom: 10px;
}

.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
