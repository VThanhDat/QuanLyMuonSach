<template>
    <div>
        <AppHeader />
        <div class="container mt-3">
            <div class="page row">
                <div class="col-md-10">
                    <InputSearchReader v-model="searchText"/>
                </div>
                <div class="mt-3 col-8">
                    <h4>Danh Sách Độc Giả
                        <i class="fa-solid fa-user"></i>
                    </h4>
                    <div class="item">
                        <button class="btn btn-sm btn-primary custom-margin" @click="refreshList()">
                            <i class="fas fa-redo"></i>Làm mới
                        </button>
                    </div>
                    <ReaderList v-if="filteredReadersCount > 0" :readers="filteredReaders"
                        v-model:activeIndex="activeIndex" />
                    <p v-else>Không có độc giả nào.</p>
                </div>
                <div class="mt-3 col-4">
                    <div v-if="activeReader">
                        <h4>
                            Chi tiết độc Giả
                            <i class="fa-solid fa-user"></i>
                        </h4>
                        <ReaderDetail :reader="activeReader"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/admin/AppHeader.vue';
import InputSearchReader from '@/components/admin/InputSearch.vue';
import ReaderList from '@/components/admin/ReaderList.vue';
import ReaderDetail from '@/components/admin/ReaderDetail.vue';
import ReaderService from "@/services/admin/reader.service";

export default {
    components: {
        ReaderDetail,
        InputSearchReader,
        ReaderList,
        AppHeader,
    },
    data() {
        return {
            readers: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
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
        activeReader() {
            if (this.activeIndex < 0) return null;
            return this.filteredReaders[this.activeIndex];
        },
        filteredReadersCount() {
            return this.filteredReaders.length;
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

.item{
    padding-bottom: 10px;
}
</style>