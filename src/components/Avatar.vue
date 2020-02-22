<template>
  <div
    class="avatar_container"
    :style="{
      'background-color':
        (userData && userData['initiator'] == 'syn') ||
        (user['avatar'] || (userData && userData['initiator'] == 'syn'))
          ? 'inherit'
          : avatarColourArray[userId % avatarColourArray.length]
    }"
  >
    <img
      v-if="user['avatar'] || (userData && userData['initiator'] == 'syn')"
      :src="
        userData && userData['initiator'] == 'syn' ? synAvatar : user['avatar']
      "
    />
    <span class="avatar_letter" v-else>
      {{
        user["firstname"] ? user["firstname"].substr(0, 1).toUpperCase() : "U"
      }}
    </span>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import synAvatar from "@/../public/assets/icons/favicon-48.png";

export default {
  name: "Avatar",
  data: function() {
    return {
      synAvatar
    };
  },
  props: {
    userId: String | Number,
    userData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(["operatorLookup"]),
    ...mapState(["avatarColourArray"]),
    user() {
      let user = {};

      if (this.userData) {
        user = this.userData;
      }

      if (this.userId) {
        user = Object.assign(
          {},
          user,
          this.operatorLookup(parseInt(this.userId))
        );
      }

      return user;
    }
  }
};
</script>

<style scoped lang="scss">
.avatar_container {
  width: 40px;
  height: 40px;
  display: flex;
  overflow: hidden;
  background-color: #5f6d7a;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 22px;

  img {
    width: 100%;
  }

  &.large {
    width: 250px;
    height: 250px;
    font-size: 72px;
  }
  &.larger {
    width: 50px;
    height: 50px;
  }
  &.small {
    width: 30px;
    height: 30px;
  }
  &.fit {
    width: 100%;
    height: 100%;
    font-size: 0.75em;
  }
}
</style>
