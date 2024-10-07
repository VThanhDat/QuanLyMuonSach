const adminRoutes = [
    {
        path: "/admin/books",
        name: "book",
        component: () => import("@/views/admin/pages/books/Book.vue"),
    },
    {
        path: "/admin/books/reader",
        name: "reader",
        component: () => import("@/views/admin/pages/books/Reader.vue"),
    },
    {
        path: "/admin/books/:id",
        name: "book.edit",
        component: () => import("@/views/admin/pages/books/BookEdit.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/admin/pages/books/NotFound.vue"),
    },
]

export default adminRoutes;