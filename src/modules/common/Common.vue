<template>
  <!-- Main pages -->

  <div class="common_content_wrapper">
    <nprogress-container></nprogress-container>
    <div class="main_wrapper">
      <keep-alive>
        <Navigation />
      </keep-alive>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

import Navigation from "./navigation/Navigation.vue";

import NprogressContainer from "vue-nprogress/src/NprogressContainer";

export default {
  name: "Common",
  data: function() {
    return {};
  },
  components: {
    Navigation,
    NprogressContainer
  },
  created() {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  },
  computed: {
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapActions(["submitAjax"])
  }
};
</script>

<style scoped lang="scss">
.common_content_wrapper {
  display: flex;
  height: 100%;
}
.main_wrapper {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
