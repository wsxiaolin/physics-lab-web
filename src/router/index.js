import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import BlackHole from "../views/BlackHole.vue";
import Test from "../views/test.vue";
import Notifications from "../components/messages/NotificationList.vue";

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
    path: "/t",
    name: "test",
    component: Test,
  },
  {
    path: "/notifications",
    name: "notifications",
    component: Notifications,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
