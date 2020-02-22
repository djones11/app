import Vue from "vue";

const parser = require("ua-parser-js");

export default function applyInitChatValues(source) {
  let ua = parser(source["user_agent"]);
  let values = {
    browser: ua["browser"]["name"],
    os: `${ua["os"]["name"]} ${ua["os"]["version"]}`,
    newMessage: "",
    pendingMessages: [],
    mode: "chat"
  };

  for (let property in values) {
    Vue.set(source, property, values[property]);
  }
}
