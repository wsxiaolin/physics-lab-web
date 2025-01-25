import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import BlackHole from "../views/BlackHole.vue";
import Notification from "../views/Notifications.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/black-hole",
    name: "BlackHole",
    component: BlackHole,
  },
  {
    path: "/notifications",
    name: "notifications",
    component: Notification,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
