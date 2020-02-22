<template>
  <div class="login_wrapper">

    <!-- Brand container -->

    <div v-show="state < 3">
      <div
        v-show="
          !userInformation['avatar'] || state == 0 || !imagesLoaded['avatar']
        "
        class="login_icon default_avatar"
      >
        <img src="@/../public/assets/images/default_avatar.png" />
      </div>
      <transition name="tada">
        <div
          v-show="
            userInformation['avatar'] && state > 0 && imagesLoaded['avatar']
          "
          class="login_icon image_found"
        >
          <img
            @load="imagesLoaded['avatar'] = true"
            :src="userInformation['avatar']"
          />
        </div>
      </transition>
      <div class="name_container">
        <span v-show="state > 0">{{
          userInformation["nickname"] ? userInformation["nickname"] : username
        }}</span>
      </div>
    </div>
    <div
      class="login_container"
      :class="{
        new_user: state >= 5
      }"
    >
      <MfaSetup
        v-if="state >= 3 && state <= 4"
        @updateType="updateType"
        :state="state"
        :mfaSecret="mfaSecret"
        :mfaType="mfaType"
      />
      <NewUserSetup
        v-if="state > 4"
        :state="state"
        @updateState="updateState"
        @updateAlert="emitAlert"
      />

      <!-- Username/Password login -->

      <form
        class="login_init_container login_sub_container"
        v-if="this.state <= 2"
      >
        <div
          class="move_container username_container"
          :style="{ left: state * -100 + '%' }"
        >
          <FormInputField
            tab="-1"
            msg="Username"
            key="username"
            v-model="username"
            class="login_theme"
            :clear="true"
            @keyup="checkKeyup($event)"
          />
        </div>
        <div
          class="move_container password_container"
          :style="{ left: state * -100 + '%' }"
        >
          <FormInputField
            tab="-1"
            msg="Password"
            key="password"
            v-model="password"
            type="password"
            class="login_theme"
            :clear="true"
            @keyup="checkKeyup($event)"
          />
        </div>

        <!-- MFA submission -->

        <div
          class="move_container"
          v-if="state == 2"
          :style="{ left: state * -100 + '%' }"
        >
          <FormInputField
            tab="-1"
            msg="MFA"
            key="mfa"
            maxlength="6"
            inputMask="numbers"
            v-model="mfa"
            :clear="true"
            class="login_theme"
            @keyup="checkKeyup($event)"
          />
        </div>
      </form>

      <!-- Login navigation button -->

      <Navigation
        v-if="state < 5"
        :showForward="
          `${($data[stateXref[state]] == undefined ||
            $data[stateXref[state]].length) > 0 && !loading}` === 'true'
        "
        :showBackward="state > 0 === true"
        :loading="loading"
        @goBack="goBack()"
        @goForward="goForward()"
      >
        <div
          class="under_container capslock_on"
          v-show="capslock == true && state == 1"
        >
          <div class="under_subcontainer">
            <span class="icon icon-arrow-up5"></span>
            <span>Capslock on</span>
          </div>
        </div>
        <div
          class="under_container resend_mfa"
          v-show="state == 2 && mfaMethod == 'email'"
        >
          <div class="under_subcontainer syn_link_button" @click="resendCode()">
            <span class="icon icon-envelope2"></span>
            <span>Resend MFA</span>
          </div>
        </div>
        <div class="new_user_container">
          <SynButton
            class="no_background"
            @click="goTonewUserSetup"
            buttonText="Sign up here"
          />
        </div>
      </Navigation>
    </div>    
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";

import localForage from "localforage";

import Navigation from "./Navigation.vue";

import FormInputField from "@/components/input/FormInputField.vue";
import SynButton from "@/components/input/SynButton.vue";
import Loader from "@/components/Loader.vue";

const MfaSetup = () => ({
  component: import("./MfaSetup.vue"),
  loading: Loader,
  delay: 0
});

const NewUserSetup = () => ({
  component: import("./NewUserSetup.vue"),
  loading: Loader,
  delay: 0
});

const defaultData = {
  state: 0,
  imagesLoaded: {
    avatar: false
  },
  loading: false,
  username: "",
  password: "",
  mfa: "",
  mfaType: "",
  mfaSecret: {},
  stateXref: {
    0: "username",
    1: "password",
    2: "mfa",
    3: "mfaType",
    4: "mfaInfo",
    5: "newUsername",
    6: "newUser",
    7: "confirmPassword"
  },
  capslock: false,
  focusCheck: 0,
  focusCheckTimeout: null
};

export default {
  name: "Login",
  data: function() {
    return JSON.parse(JSON.stringify(defaultData));
  },
  components: {
    FormInputField,
    Navigation,
    MfaSetup,
    NewUserSetup,
    SynButton
  },
  activated() {
    this.resetState();
    this.emitAlert({});

    if (this.$route.params["error"]) {
      let error = this.$route.params["error"];
      this.emitAlert({
        value: `${error["Error"]}: ${error["Description"]}`
      });
    }
  },
  deactivated() {
    clearInterval(this.focusCheckTimeout);
  },
  computed: {
    ...mapState([
      "deviceInformation",
      "clientInformation",
      "userInformation",
      "lastModXref",
      "clientIdentified"
    ])
  },
  methods: {
    ...mapActions(["submitAjax"]),
    ...mapMutations([
      "UPDATE_USER_INFORMATION",
      "REMOVE_GLOBAL_INTERVAL",
      "UPDATE_FULLPAGE_LOADER"
    ]),
    resendCode() {
      this.mfa = "";
      this.submitCredentials();
    },
    updateState(value) {
      this.state = value;
    },
    resetState(partial = false) {
      let data = JSON.parse(JSON.stringify(defaultData));

      if (partial == true) {
        data["username"] = this.username;
      }

      Object.assign(this.$data, data);
    },
    goBack() {
      let returnToPasswordStates = [3, 5, 6];
      this.mfa = "";
      this.emitAlert({});

      if (returnToPasswordStates.indexOf(this.state) == -1) {
        this.state--;
      } else {
        this.state = 1;
      }
    },
    goForward() {
      switch (this.state) {
        case 1:
        case 2:
        case 4:
          this.submitCredentials();
          break;
        default:
          this.state++;
      }
    },
    checkKeyup(e) {
      if (!this.loading) {
        if (e.keyCode == 27 && this.state > 0) {
          this.goBack();
        } else if (
          e.keyCode == 13 &&
          this.$data[this.stateXref[this.state]].length > 0
        ) {
          this.goForward();
        } else {
          this.capslock =
            e.getModifierState && e.getModifierState("CapsLock") ? true : false;
        }
      }
    },
    updateType(value) {
      this.mfaType = value;
    },
    emitAlert(payload) {
      this.$emit("alert", payload);
    },
    goTonewUserSetup(response) {
      this.UPDATE_USER_INFORMATION({
        token: response["token"]
      });

      this.state = 5;

      if (response["initialize"] == true) {
        this.emitAlert({
          value: "This is your first time logging in. Please create a new password for your account.",
          type: "info"
        });
      }
    },
    logInUser(response) {
      this.loading = true;

      this.UPDATE_USER_INFORMATION({
        token: response["token"]
      });

      localForage.getItem("token", () => {
        if (
          this.$route.params["nextUrl"] != null &&
          this.$route.params["nextUrl"] != "/Login"
        ) {
          this.$router.push(this.$route.params.nextUrl);
        } else {
          let redirectPage = !response["last_module"]
            ? this.lastModXref[1]
            : this.lastModXref[response["last_module"]];

          this.$router.push({
            name: redirectPage
          });
        }
      });
    },
    goToMfaSetup(response) {
      this.emitAlert({});

      this.mfaSecret = response["mfa"];
      this.state = 3;
    },
    handleError() {

    },
    submitCredentials() {
      let credentials = {
        body: {
          username: this.username,
          password: this.password,
          mfa: this.mfa ? this.mfa : undefined,
          method: this.mfaType ? this.mfaType : undefined
        },
        url: "login",
        error: "Login request failed"
      };

      this.loading = true;

      this.submitAjax(credentials)
        .then(response => {
          response = response["data"];
          this.loading = false;

          // Credentials recognised

          if (response["authorised"]) {
            this.mfaMethod = response["mfa"]["method"];

            if (response["mfa"]["initialize"] === true) {
              if (response["password_expired"] == true) {
                this.goTonewUserSetup(response);
              } else {
                this.goToMfaSetup(response);
              }

              // Password has expired MFA has already been set up
            } else if (
              response["password_expired"] == true &&
              response["mfa"]["authorised"] === true
            ) {
              this.goTonewUserSetup(response);

              // Login successful
            } else if (response["mfa"]["authorised"]) {
              this.logInUser(response);
            } else {
              switch (this.state) {
                // Input MFA

                case 1:
                  this.emitAlert({
                    value: "Please enter your MFA code below",
                    type: "info"
                  });
                  this.state = 2;
                  break;

                case 2:
                  // Incorrect MFA

                  if (this.mfa) {
                    this.emitAlert({
                      value: "Incorrect 2FA code, please try again."
                    });
                  } else {
                    // Resend MFA

                    this.emitAlert({
                      value: "A new MFA code has been sent to your email address.",
                      type: "info"
                    });
                  }
                  break;

                // Submit MFA type

                case 4:
                  this.emitAlert({
                    value: "Your 2FA has been successfully setup. Please enter your code below.",
                    type: "success"
                  });
                  this.state = 2;
                  break;
              }
            }
          } else {
            // Incorrect login details

            this.resetState(true);
            this.emitAlert({
              value: "Your login details are incorrect. Please try again"
            });
          }
        })
        .catch(error => {
          this.loading = false;
          this.resetState(true);
          this.handleError(error);

          console.warn(error);
        });
    }
  },
  watch: {
    state: function() {
      // Selects the next input field

      this.focusCheck = 0;
      clearInterval(this.focusCheckTimeout);

      this.focusCheckTimeout = setInterval(() => {
        const element = document.getElementById(this.stateXref[this.state]);

        if (element) {
          element.focus();
          clearInterval(this.focusCheckTimeout);
        } else {
          this.focusCheck++;

          if (this.focusCheck >= 10) {
            clearInterval(this.focusCheckTimeout);
          }
        }
      }, 250);
    }
  }
};
</script>

<style scoped lang="scss">
.login_wrapper {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  flex-direction: column;
  justify-content: flex-start;
}
.feedback_request_container {
  position: fixed;
  right: 24px;
  top: 24px;
  padding: 12px 24px;
  color: $light_text_colour;
  border-radius: 12px;
  border: 2px solid $light_text_colour;
}
.request_feedback_text {
  color: $light_text_colour;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
.close_feedback_icon {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px 4px 4px 4px;
  color: $normal_text_colour;
  border-radius: 50%;
  background-color: $light_text_colour;
  font-size: 0.75em;
  cursor: pointer;

  &:hover {
    background-color: $off-white;
  }
}
.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  max-width: 520px;
  margin: 0 auto;
  white-space: nowrap;
  overflow-y: auto;

  &.new_user {
    overflow: visible;
  }

  ::v-deep .login_sub_container {
    overflow: hidden;

    & > * {
      position: relative;
      max-height: 350px;
      width: 100%;
      padding: 5%;
    }

    & > .move_container {
      display: inline-block;
      padding: 0 5%;
      vertical-align: top;
      transition: all 0.2s ease-in-out;
      overflow: auto;
    }
  }
}
.name_container {
  height: 50px;
  text-align: center;
  color: $light_text_colour;
}
.login_icon {
  max-width: 150px;
  max-height: 150px;
  width: 30%;
  margin: 50px auto 20px auto;
  padding: calc(3% + 12px);
  border-radius: 50%;
  border: 5px solid #e4e4e4;
  text-align: center;
  overflow: hidden;

  &.image_found {
    padding: 0;
  }

  img {
    display: inline-block;
    vertical-align: middle;
  }
}
.under_container {
  &.capslock_on {
    color: $orange;
  }
  &.resend_mfa {
    .under_subcontainer {
      cursor: pointer;
    }
  }
  .under_subcontainer {
    display: inline-block;
  }
  .icon {
    position: relative;
    top: 2px;
    font-size: 1.1em;
    padding-right: 8px;
  }
}
.new_user_container {
  position: relative;
  top: 56px;
  font-size: 1.4em;

  & /deep/ .button {
    color: $light_text_colour;
  }
}

/*
___  ______________ _____ _      _____ 
|  \/  |  _  | ___ \_   _| |    |  ___|
| .  . | | | | |_/ / | | | |    | |__  
| |\/| | | | | ___ \ | | | |    |  __| 
| |  | \ \_/ / |_/ /_| |_| |____| |___ 
\_|  |_/\___/\____/ \___/\_____/\____/ 
                                       
*/

.mob,
.tablet {
  .feedback_request_container {
    bottom: 0;
    top: auto;
    right: 0;
    left: 0;
    z-index: 1;
    border: 0;
    text-align: center;
  }

  .close_feedback_icon {
    display: none;
  }
}
</style>
