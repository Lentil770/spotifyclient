import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RedirectView from "../views/RedirectView.vue";
import LoginView from "../views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem("spotify_access_token")) {
          next("/login");
        } else {
          next();
        }
      },
    },
    // {
    //   path: "/redirect",
    //   name: "redirect",
    //   component: RedirectView,
    // },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        hideNavbar: true,
      },
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
