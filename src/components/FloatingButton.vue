<template>
  <div
    class="floating_button_wrapper"
    :style="{
      flex: width
    }"
  >
    <div
      :class="[
        `floating_button_container ${colourClass}`,
        {
          active: active
        }
      ]"
      @click="$emit('click', id)"
    >
      <h4 class="floating_button_text" v-if="text">{{ text }}</h4>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatingButton",
  props: {
    text: String,
    id: {
      type: Number | String,
      default: 0
    },
    cols: {
      type: Number,
      default: 1
    },
    colourClass: {
      type: String,
      default: ""
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    width() {
      return this.$mq == "desktop"
        ? "0 0 " + 100 / this.cols + "%"
        : "1 1 100%";
    }
  }
};
</script>

<style scoped lang="scss">
.floating_button_wrapper {
  position: relative;
  height: calc(2vw + 8em);
  min-width: 200px;
  padding: 8px;
  font-size: 1.1em;
  user-select: none;
}
.floating_button_container {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 1em;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border: 3px solid #c5d0de;
  cursor: pointer;
  justify-content: center;
  border-radius: 10px;
  transition: all 150ms ease-in-out;

  &.active.knowledge {
    border-color: $internal_knowledge;
  }

  &.active.livechat {
    border-color: $light_green;
  }

  &:hover {
    box-shadow: 0px 2px 20px 2px rgba(0, 0, 0, 0.1);

    &.knowledge {
      border-color: $internal_knowledge;
    }

    &.livechat {
      border-color: $light_green;
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
  .floating_button_wrapper {
    flex-grow: 1;
  }
}
</style>
