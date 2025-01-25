import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/black-hole",
    name: "BlackHole",
    component: () => import("../views/BlackHole.vue"),
  },
  {
    path: "/notifications",
    name: "notifications",
    component: () => import("../views/Notifications.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
