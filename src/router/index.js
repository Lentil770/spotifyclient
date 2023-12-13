import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RedirectView from "../views/RedirectView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "default",
      component: RedirectView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
    },
    {
      path: "/redirect",
      name: "redirect",
      component: RedirectView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
