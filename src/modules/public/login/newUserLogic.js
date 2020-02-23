// This file holds the base logic for new password components and can be extended with local functionality

import { mapActions, mapGetters } from "vuex";

import FormInputField from "@/components/input/FormInputField.vue";
import Loader from "@/components/Loader.vue";

import PassGuideBox from "./PassGuideBox.vue";

export default {
  name: "newUserLogic",
  data: function() {
    return {
      loading: false,
      newUser: "",
      confirmPassword: "",
      showPassguide: false,
      passwordValidator: {
        upperCase: {
          type: "regex",
          value: /[A-Z]/g,
          result: false
        },
        lowerCase: {
          type: "regex",
          value: /[a-z]/g,
          result: false
        },
        number: {
          type: "regex",
          value: /[0-9]/g,
          result: false
        },
        minLength: {
          type: "minlength",
          value: 8,
          result: false
        },
        notEqualTo: {
          type: "notEqualTo",
          value: "",
          result: false
        }
      }
    };
  },
  components: {
    FormInputField,
    PassGuideBox,
    Loader
  },
  methods: {
    ...mapActions(["submitAjax"]),
    submitPassword(callback) {
      let credentials = {
        body: {
          username: this.username,
          password: this.newPassword
        },
        method: "PUT",
        url: "login",
        error: "Failed to submit user details"
      };

      // Submit new password

      this.loading = true;

      this.submitAjax(credentials)
        .then(response => {
          this.loading = false;

          response = response["data"];

          if (callback) callback["success"](response);
        })
        .catch(error => {
          this.loading = false;

          if (callback) callback["fail"](error);
          console.warn(error);
        });
    }
  }
};
