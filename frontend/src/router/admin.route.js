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
]

export default adminRoutes;