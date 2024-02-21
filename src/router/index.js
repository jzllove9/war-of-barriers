import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      meta: {
        title: "",
      },
      redirect: "home",
    },
    {
      path: "/home",
      meta: {
        title: "主页",
      },
      component: () => import("../views/HomeView.vue"),
    },
  ],
});

export default router;
