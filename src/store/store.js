import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import axiosRetry from "axios-retry";
import state from "./state.js";
import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

import Login from "./Login/store";
import Common from "./Common/store";

Vue.use(Vuex);

axiosRetry(axios, {
  retries: 0,
  retryDelay: () => {
    return 1000;
  },
  retryCondition: response => {
    return response["status"] !== 200;
  }
});

axios.defaults.baseURL =
  "https://egqg04x5sa.execute-api.eu-west-2.amazonaws.com/dev";

export default new Vuex.Store({
  modules: {
    Login,
    Common
  },
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
});
