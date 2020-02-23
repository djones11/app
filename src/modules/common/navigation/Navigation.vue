<template>
  <nav class="main_navigation">
    <!-- Profile -->

    <div class="left_side_wrapper">
      <div
        class="profile_container"
        @click="toggleActionBox($event, 'showProfile')"
      >
        <ActionBox
          :visibility="showActionBox['showProfile']"
          key="navProfileBox"
          :config="profileBoxConfig"
          @hide="hideActionBox"
        />
        <div class="avatar_wrapper">
          <Avatar :userId="userInformation['user_id']" />
        </div>
        <div class="profile_information_container">
          <span class="name_container">
            <span class="text">{{ userInformation["firstname"] }}</span>
            <span class="icon icon-chevron-down2"></span>
          </span>
        </div>
      </div>
    </div>

    <TabbedMenu
      v-if="$route['matched'][1]"
      :menuItems="menuItems"
      :mode="$mq == 'desktop' ? '' : 'icons_only'"
      :activeItem="$route['matched'][1]['name']"
      class="menu_container dark"
      :class="{
        vertical: $mq != 'desktop'
      }"
      @hide="hideActionBox"
    />
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

import TabbedMenu from "@/components/TabbedMenu.vue";

export default {
  name: "Navigation",
  data: function() {
    return {};
  },
  components: {
    TabbedMenu
  },
  computed: {
    ...mapState(["userInformation"]),
    menuItems() {
      return [];
    }
  },
  methods: {
    ...mapActions(["submitAjax"])
  }
};
</script>

<style scoped lang="scss">
.main_navigation {
  z-index: 6;
  display: flex;
  padding: 0 18px;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.left_side_wrapper {
  display: flex;
  align-items: center;
}
.profile_container {
  position: relative;
  display: flex;
  cursor: pointer;
}
.profile_information_container {
  display: flex;
  padding-left: 16px;
  flex-direction: column;
  justify-content: space-between;

  .text {
    font-weight: 600;
  }

  & /deep/ .icon {
    margin-right: 6px;
  }

  .icon-chevron-down2 {
    padding-left: 6px;
    font-size: 0.75em;
  }
}
.name_container {
  font-size: 0.9em;
}
.menu_container {
  z-index: 6;
  top: 0;
  font-size: 1.3em;
  background-color: inherit;
  transition: right 0.15s linear;
  white-space: nowrap;

  & /deep/ .main_navigation {
    .text {
      font-size: 0.6em;
      font-weight: 600;
    }

    .navigation_list {
      justify-content: flex-end;
    }

    .navigation_item {
      flex: initial;
    }
  }
}

/*
___  ___      _     _ _      
|  \/  |     | |   (_) |     
| .  . | ___ | |__  _| | ___ 
| |\/| |/ _ \| '_ \| | |/ _ \
| |  | | (_) | |_) | | |  __/
\_|  |_/\___/|_.__/|_|_|\___|
                             
*/

.mob,
.tablet {
  .active ~ .menu_container {
    right: 0;
  }

  .menu_container {
    position: fixed;
    right: -120px;
    height: 100vh;
    width: auto;
    font-size: 1.5em;
    background-color: #fff;
    flex-direction: column;
    justify-content: flex-start;
  }
}
</style>
