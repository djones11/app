<template>
  <!-- Pre-login pages -->

  <div class="public_wrapper">
    <div class="upper_main_container">
      <div class="login_logo">
        <transition name="move-down">
          <img
            :src="defaultImage"
          />
        </transition>
      </div>
      <div :class="`message_container ${alertMessage['type']}`">
        <h5>{{ alertMessage["value"] }}</h5>
      </div>
    </div>
    <router-view @alert="updateAlert"></router-view>
  </div>
</template>

<script>

import defaultImage from "@/images/synthetix_logo.png";

export default {
  name: "Public",
  data: function() {
    return {
      alertMessage: {
        value: "",
        type: "alert"
      },
      defaultImage
    }
  },
  methods: {
    updateAlert({ value = "", type = "alert" }) {
      this.alertMessage["value"] = value;
      this.alertMessage["type"] = type;
    }
  }
}

</script>

<style scoped lang="scss">
.public_wrapper {
  display: flex;
  height: 100%;
  padding-top: calc(40vh - 200px);
  flex-direction: column;
  align-items: center;
  background-color: #44515b;
}
.upper_main_container {
  position: relative;
  min-height: 120px;
  width: 100%;
}
.login_logo {
  will-change: transform;
  font-family: "Open Sans", Verdana, Helvetica, sans-serif;
  color: $light_text_colour;
  text-align: center;
  font-size: 1.5em;
  letter-spacing: 18px;

  img {
    width: 75%;
    max-width: 300px;
  }
}
.message_container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -35px;
  z-index: 1;
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  justify-content: center;
  font-size: calc(0.2vw + 14px);
  text-align: center;

  &.alert {
    color: $light_orange;
  }
  &.info {
    color: $light_text_colour;
  }
  &.success {
    color: $bright_green;
  }
}
</style>