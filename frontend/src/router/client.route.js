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
  
]

export default clientRoutes;