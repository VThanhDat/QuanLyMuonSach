const clientRoutes = [
    {
        path: "/books",
        name: "book-client",
        component: () => import("@/views/client/pages/books/ClientBook.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/client/pages/books/ClientNotFound.vue"),
    },
    {
        path: "/reader/borrow",
        name: "borrow-client",
        component: () => import("@/views/client/pages/books/BorrowBook.vue"),
    },
]

export default clientRoutes;