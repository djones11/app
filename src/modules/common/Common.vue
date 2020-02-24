<template>
  <!-- Main pages -->

  <div class="common_content_wrapper">
    <nprogress-container></nprogress-container>
    <div class="main_wrapper">
      <div class="navigation_wrapper">
        <TabbedMenu
          :menuItems="menuConfig"
          :activeItem="activeItem"
          mode="tabbed"
          @click="selectTab"
        />
      </div>
      <keep-alive v-if="userInformation['token']">
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import NprogressContainer from "vue-nprogress/src/NprogressContainer";

import TabbedMenu from "@/components/TabbedMenu";

export default {
  name: "Common",
  data: function() {
    return {
      activeItem: 1
    };
  },
  components: {
    NprogressContainer,
    TabbedMenu
  },
  created() {
    this.activeItem = this.$route["name"] == "Photos" ? 1 : 0;

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    menuConfig() {
      return [
        {
          name: "Upload photos",
          icon: "icon-cloud-upload4",
          view: "UploadPhoto"
        },
        {
          name: "My photos",
          icon: "icon-photo-group",
          view: "Photos"
        }
      ];
    }
  },
  methods: {
    selectTab(item) {
      this.activeItem = item["index"];
    }
  }
};
</script>

<style scoped lang="scss">
.common_content_wrapper {
  display: flex;
  height: 100%;
  padding-top: calc(40vh - 200px);
  flex-direction: column;
  align-items: center;
  background-color: #44515b;
}
.main_wrapper {
  position: relative;
  max-width: 800px;
  width: 100%;
  height: 100%;
  flex: 1;
  color: $light_text_colour;
  background-color: inherit;
}
.navigation_wrapper {
  padding-bottom: 48px;
}
</style>
