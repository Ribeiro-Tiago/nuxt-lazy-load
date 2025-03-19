import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin({
  name: "lazyload-css",
  parallel: true,
  setup() {},
  hooks: {
    "app:created"() {
      const update = (ev: UIEvent) => {
        // if (val < 767) {
        //   useHead({
        //     link: [
        //       {
        //         key: "mobile",
        //         rel: "stylesheet",
        //         type: "text/css",
        //         href: "/assets/css/mobile.css",
        //       },
        //     ],
        //   });
        //   window.removeEventListener("resize", update);
        // }
      };

      window.addEventListener("resize", update, { passive: true });
    },
  },
  env: { islands: false },
});
