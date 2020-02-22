<template functional>
  <div
    class="floating_hover_button"
    :class="[data.staticClass, data.class]"
    @click="listeners.click($event, props.id)"
    v-html="props.text"
  ></div>
</template>

<script>
export default {
  name: "FloatingCircleButton",
  props: {
    text: String,
    id: {
      type: Number | String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.floating_hover_button {
  padding: 0.7em;
  border-radius: 50%;
  box-shadow: 0;
  background-color: #fff;
  font-size: 16px;
  opacity: 0.9;
  cursor: pointer;

  &.dark {
    color: #fff;
    background-color: $light_blue;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
