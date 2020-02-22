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
    } else if (payload.hasOwnProperty("preferences")) {
      for (let property in defaultPreferences) {
        if (!payload["preferences"].hasOwnProperty(property)) {
          Vue.set(
            payload["preferences"],
            property,
            defaultPreferences[property]
          );
        }
      }
    }

    applyDeepMerge(state["userInformation"], payload);
  }
};
