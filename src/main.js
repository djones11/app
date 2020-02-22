import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import NProgress from "vue-nprogress";
import VueMq from "vue-mq";
import store from "./store/store.js";

const nprogress = new NProgress({
  showSpinner: false
});

Vue.config.productionTip = false;

Vue.use(NProgress, {
  latencyThreshold: 0
});

Vue.use(VueMq, {
  breakpoints: {
    mob: 500,
    tablet: 900,
    desktop: Infinity
  }
});

new Vue({
  router,
  store,
  nprogress,
  render: h => h(App)
}).$mount("#app");
