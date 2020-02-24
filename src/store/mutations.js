import axios from "axios";
import localForage from "localforage";
import Vue from "vue";

import deepMerge from "@/mixins/applyDeepMerge.js";

const applyDeepMerge = deepMerge["methods"]["applyDeepMerge"];

export default {
  UPDATE_USER_INFORMATION(state, payload) {
    if (payload["token"]) {
      localForage.setItem("token", payload["token"]);
      axios.defaults.headers["Authorization"] = payload["token"];
    }

    applyDeepMerge(state["userInformation"], payload);
  },
  ADD_GLOBAL_INTERVAL(state, payload) {
    // Starts the timer once the previous interval has completed

    const ADD_GLOBAL_INTERVAL = () => {
      if (state.globalIntervals[payload["id"]]) {
        clearTimeout(state.globalIntervals[payload["id"]]);
        Vue.delete(state.globalIntervals, payload["id"]);
      }

      if (payload["immediate"] && payload["body"]) {
        payload["body"]();
        payload["immediate"] = false;
      }

      if (state.globalIntervals[payload["id"]] != "deleted") {
        Vue.set(
          state.globalIntervals,
          payload["id"],
          setTimeout(
            () => {
              payload["body"]()
                .then(() => {
                  if (state.globalIntervals[payload["id"]] != "deleted") {
                    ADD_GLOBAL_INTERVAL(state, payload);
                  }
                })
                .catch(() => {
                  if (state.globalIntervals[payload["id"]] != "deleted") {
                    ADD_GLOBAL_INTERVAL(state, payload);
                  }
                });
            },
            state["userInformation"]["status"] == "Offline" ||
              !state["userInformation"]["status"]
              ? payload["duration"]
              : payload["duration"] * state["timeoutMod"]
          )
        );
      }
    };

    if (payload["id"]) {
      ADD_GLOBAL_INTERVAL(state, payload);
    }
  },
  REMOVE_GLOBAL_INTERVAL(state, payload) {
    if (!payload) {
      for (let interval in state.globalIntervals) {
        clearTimeout(state.globalIntervals[interval]);
        Vue.set(state.globalIntervals, interval, "deleted");
      }
    } else {
      clearTimeout(state.globalIntervals[payload]);
      Vue.set(state.globalIntervals, payload, "deleted");
    }
  }
};
