<template>
  <div class="button_container">
    <div class="loader_container">
      <Loader class="go_foward small_loader inline" :loading="loading" />
    </div>
    <button
      v-show="showForward && !loading"
      class="syn_link_button go_forward"
      @click="$emit('goForward', $event)"
    >
      Next<span class="icon icon-chevron-right2"></span>
    </button>
    <div class="under_container">
      <slot></slot>
    </div>
    <button
      v-show="showBackward"
      class="syn_link_button go_back"
      @click="$emit('goBack', $event)"
    >
      <span class="icon icon-chevron-left2"></span>Back
    </button>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "Navigation",
  data: function() {
    return {};
  },
  props: {
    loading: Boolean,
    showForward: Boolean,
    showBackward: Boolean
  },
  components: {
    Loader
  }
};
</script>

<style scoped lang="scss">
.button_container {
  position: relative;
  display: inline-block;
  height: 56px;
  width: 100%;
  padding: $login_padding;

  button {
    position: relative;
    z-index: 1;

    span {
      vertical-align: middle;
      font-size: 1.1em;
      padding: 0 5px;
    }
  }
}
.go_forward {
  float: right;
}
.go_back {
  float: left;
}
.loader_container {
  position: relative;
  float: right;
  right: 34px;
  top: 8px;
  z-index: 1;
}
.under_container {
  position: absolute;
  top: calc(50% - 2px);
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
  font-size: 0.9em;
  transform: translateY(-50%);
}
</style>
