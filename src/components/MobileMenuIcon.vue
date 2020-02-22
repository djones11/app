<template>
  <div
    :class="{ active: active == true }"
    class="mobile_nav_toggle"
    @click="toggleMenu($event)"
    v-click-outside="closeMenu"
  >
    <div class="burger_menu_toggle">
      <span class="burger_line line1"></span>
      <span class="burger_line line2"></span>
      <span class="burger_line line3"></span>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";

export default {
  name: "MobileMenuIcon",
  data: function() {
    return {
      active: false
    };
  },
  components: {},
  directives: {
    ClickOutside
  },
  activated: function() {},
  methods: {
    toggleMenu($event) {
      $event.stopPropagation();
      this.active = !this.active;
    },
    closeMenu() {
      this.active = false;
    }
  }
};
</script>

<style scoped lang="scss">
.mobile_nav_toggle {
  display: none;
  width: 28px;
  height: 100%;
  float: right;
  margin: 0;
  padding: 15px 0;
}
.burger_menu_toggle {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: block;
  padding: 0px;
  cursor: pointer;
}
.burger_menu_toggle .burger_line {
  position: absolute;
  width: 100%;
  height: 3px;
  margin: 0 auto;
  display: block;
  clear: both;
  background-color: $normal_text_colour;
  border-radius: 8px;
  transition: all 0.2s ease-out;
}
.burger_menu_toggle .line1 {
  top: 2px;
  left: 0;
}
.burger_menu_toggle .line2 {
  top: 12px;
  left: 0;
  opacity: 1;
  transition: all 0.1s linear;
}
.burger_menu_toggle .line3 {
  top: 22px;
  right: 0;
}
.active .line1 {
  transform: rotate(45deg);
  top: 12px !important;
}
.active .line2 {
  opacity: 0;
}
.active .line3 {
  transform: rotate(-45deg);
  top: 12px !important;
}

.mob,
.tablet {
  .mobile_nav_toggle {
    display: block;
  }
}
</style>
