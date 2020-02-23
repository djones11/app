<template functional>
  <transition name="fade-both">
    <div class="overlay" v-show="props.active">
      <div
        class="overlay_outer_wrapper"
        :class="[data.staticClass, data.class]"
      >
        <span
          v-if="props.close"
          class="icon icon-cross4 close_overlay hover"
          @click="listeners.click"
        >
        </span>
        <div class="overlay_outer_container">
          <h2 class="overlay_header" v-if="props.header">{{ props.header }}</h2>
          <div class="overlay_inner_container">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Overlay",
  props: {
    header: String,
    active: Boolean,
    close: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="scss">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  width: 100%;
  padding: 10% 0;
  flex-direction: column;
  color: $light_text_colour;
  background-color: rgba(#000, 0.9);

  & > * {
    display: flex;
    overflow: hidden;
  }

  .close_overlay {
    position: absolute;
    right: 24px;
    top: 24px;
    font-size: 28px;
  }

  &.center .overlay_inner_container {
    text-align: center;
  }
}
.overlay_outer_container {
  display: flex;
  width: 100%;
  padding: 0 calc(15% - 50px);
  overflow: auto;
  flex-direction: column;
}
.overlay_inner_container {
  display: flex;
  height: 100%;
  flex-direction: column;
}
.dialog_box_wrapper {
  position: relative;
  display: flex;
  min-width: 40%;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
  padding: 3em calc(1vw + 8px);
  border: 3px solid $dark_blue;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  text-align: center;
  overflow: hidden;
}
.center {
  text-align: center;
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
  .overlay {
    position: fixed;
  }
}

.mob {
  .dialog_box_wrapper {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }
}
</style>
