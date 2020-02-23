<template>
  <div>
    <PassGuideBox
      class="passguide_wrapper"
      :active="showPassguide"
      :passwordValidator="passwordValidator"
    />
    <form class="login_sub_container" v-if="state > 4">
      <div class="move_container new_user_container">
        <h4 class="details">Enter your details below to setup your new user</h4>
        <FormInputField
          msg="Username"
          key="newUsername"
          v-model="username"
          @keyup="checkKeyup($event)"
          :clear="true"
          class="login_theme"
        />
        <FormInputField
          msg="New password"
          key="newUser"
          v-model="newPassword"
          type="password"
          @focus="showPassguide = true"
          @blur="showPassguide = false"
          @keyup="checkKeyup($event)"
          :clear="true"
          :validateConfig="passwordValidator"
          class="login_theme"
        />
        <FormInputField
          v-if="state == 7"
          msg="Confirm password"
          key="confirmPassword"
          v-model="confirmPassword"
          type="password"
          @keyup="checkKeyup($event)"
          :clear="true"
          class="login_theme confirm_password"
        />
      </div>
    </form>
    <Navigation
      v-if="state >= 5"
      :showForward="showForward"
      :showBackward="true"
      :loading="loading"
      @goBack="goBack()"
      @goForward="goForward()"
    ></Navigation>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import newUserLogic from "./newUserLogic.js";

import Navigation from "./Navigation.vue";

export default {
  name: "NewUserSetup",
  extends: newUserLogic,
  data: function() {
    return {
      username: "",
      loading: false,
      newPassword: "",
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
        }
      }
    };
  },
  props: {
    state: Number
  },
  components: {
    Navigation
  },
  computed: {
    showForward() {
      console.log(this.state);
      if (this.state == 6 || this.state == 5) {
        return this.passwordValidator["passed"] == true;
      } else {
        console.log(
          this.newPassword,
          this.confirmPassword,
          this.newPassword === this.confirmPassword
        );
        return (
          (Boolean(this.newPassword && this.confirmPassword) &&
            this.newPassword === this.confirmPassword) == true
        );
      }
    }
  },
  methods: {
    checkKeyup(e) {
      if (
        e.keyCode == 13 &&
        (this.state == 5 || (this.state > 5 && this.showForward))
      ) {
        this.goForward();
      }
    },
    goBack() {
      this.$emit("updateAlert", {});
      this.$emit("updateState", 1);
    },
    goForward() {
      console.log(this.state);
      if (this.state != 7) {
        this.$emit("updateState", 7);
      } else {
        this.submitPassword({
          success: response => {
            if (response["error"]) {
              this.$emit("updateAlert", {
                value: response["error"],
                type: "alert"
              });
            } else {
              this.$emit("updateState", 1);
              this.$emit("updateAlert", {
                value:
                  "Your user has been successfully set up. You may now log in with your new details.",
                type: "success"
              });
            }
          },
          fail: () => {
            this.$emit("updateAlert", {
              value: "Failed to submit password",
              type: "alert"
            });
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.login_sub_container {
  padding-top: 10%;
}
.details {
  padding-bottom: 10%;
  color: $light_text_colour;
  text-align: center;
}
.passguide_wrapper {
  top: calc(40% + 120px);
}
.new_user_container {
  & /deep/ .form_input_container {
    &:not(:last-of-type) {
      margin-bottom: 28px;
    }
  }
}
</style>
