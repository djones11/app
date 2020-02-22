<template>
  <form class="login_sub_container" v-if="this.state > 2 && state < 5">
    <h2 class="header">{{ getLoginLanguage["new_mfa_title"] }}</h2>
    <div
      class="move_container mfa_type_container scroll"
      :style="{ left: (state - 3) * -100 + '%' }"
    >
      <p>{{ getLoginLanguage["new_mfa_body_part_one"] }}</p>
      <p>{{ getLoginLanguage["new_mfa_body_part_two"] }}}}</p>
      <div class="mfa_selection_container">
        <FormInputCheckbox
          :msg="getLoginLanguage['new_mfa_email_option_button']"
          key="email"
          id="email_method"
          type="radio"
          name="mfa_type"
          value="email"
          class="login_theme"
          @input="updateType($event)"
        />
        <FormInputCheckbox
          :msg="getLoginLanguage['new_mfa_app_option_button']"
          key="app"
          id="app_method"
          type="radio"
          name="mfa_type"
          value="application"
          class="login_theme"
          @input="updateType($event)"
        />
      </div>
    </div>
    <div
      class="move_container mfa_info_container scroll"
      :style="{ left: (state - 3) * -100 + '%' }"
    >
      <div v-show="mfaType == 'email' && state > 3">
        <p>{{ getLoginLanguage["new_mfa_email_part_one"] }}</p>
        <p>{{ getLoginLanguage["new_mfa_email_part_two"] }}</p>
        <p>{{ getLoginLanguage["new_mfa_email_part_three"] }}</p>
        <p>{{ getLoginLanguage["new_mfa_email_part_four"] }}</p>
      </div>
      <div v-show="mfaType == 'application' && state > 3">
        <p>{{ getLoginLanguage["new_mfa_app_part_one"] }}</p>
        <img class="qr_code" :src="mfaSecret['qr']" />
        <div class="secret_key_container">
          <span
            class="show_secret_key"
            v-show="!showSecret"
            @click="showSecret = true"
            >{{ getLoginLanguage["new_mfa_app_show_code_button"] }}</span
          >
          <span class="secret_key" v-show="showSecret">{{
            mfaSecret["secret"]
          }}</span>
        </div>
        <p>{{ getLoginLanguage["new_mfa_app_part_two"] }}</p>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from "vuex";

import FormInputCheckbox from "@/components/input/FormInputCheckbox.vue";

export default {
  name: "MfaSetup",
  data: function() {
    return {
      showSecret: false
    };
  },
  props: {
    state: Number,
    mfaSecret: Object,
    mfaType: String
  },
  components: {
    FormInputCheckbox
  },
  computed: {
    ...mapGetters(["getLoginLanguage"])
  },
  methods: {
    updateType(value) {
      this.$emit("updateType", value);
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  padding: 24px 0 48px 0;
  text-align: center;
  color: $light_text_colour;
  white-space: initial;
  font-size: calc(18px + 0.5vw);
}
.move_container {
  white-space: initial;
  color: $light_text_colour;
  text-align: center;

  p {
    margin: 20px 0;
  }
}
.mfa_selection_container {
  display: flex;
  padding: 16px 0;
  justify-content: space-evenly;
}
.qr_code {
  padding: 6px 0;
}
.secret_key_container {
  padding: 16px 0 8px 0;
  color: $light_green;
  font-size: 16px;
}
.show_secret_key {
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
}
</style>
