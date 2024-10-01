import { createRouter, createWebHistory } from "vue-router";
import adminRoutes from "./admin.route";

const routes = [
    ...adminRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router