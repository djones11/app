<template functional>
  <div class="toggle_container" @click="listeners.click">
    <span v-if="props.icon" :class="`toggle_icon icon ${props.icon}`"></span>
    <slot></slot>
    <p class="toggle_text">{{ props.text }}</p>
  </div>
</template>

<script>
export default {
  name: "SlideButton",
  props: {
    icon: String,
    text: String
  }
};
</script>

<style scoped lang="scss">
.toggle_container {
  position: relative;
  display: flex;
  height: 60px;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  user-select: none;

  &:hover {
    & /deep/ .icon {
      right: 70%;
    }

    .toggle_text {
      opacity: 1;
      transition: all 0.2s linear;
      transition-delay: 0.25s;
    }
  }
  & /deep/ .icon {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    font-size: 1.5em;
    transition: all 0.3s ease-in-out;
  }
}
.toggle_text {
  opacity: 0;
  font-weight: bold;
}
</style>
