// Copy to clipboard functionaltiy

import { mapMutations, mapGetters } from "vuex";

export default {
  methods: {
    ...mapMutations(["ADD_NOTIFICATION"]),
    checkClipboardFunc(str) {
      if (!document.queryCommandSupported(str)) {
        this.ADD_NOTIFICATION({
          title: "Feature not supported",
          message: "Copy to clipboard functionality doesn't work with the current version of your browser. Browser support: Chrome 42+, Firefox 42+, internet Explorer 10+,  Opera 29+, and  Safari 10+"
        });

        return false;
      }

      return true;
    },
    copyToClipboard(value) {
      if (!this.checkClipboardFunc("copy")) {
        return false;
      }

      let id = "copy_to_clipboard_temp";
      let input = document.createElement("textarea");

      input.setAttribute("id", id);
      input.value = value;

      document.body.appendChild(input);

      let inputNode = document.getElementById(id);

      inputNode.select();
      document.execCommand("copy");

      inputNode.parentNode.removeChild(inputNode);
    }
  }
};
