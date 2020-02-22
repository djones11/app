<template functional>
  <transition :name="props.fadeType">
    <div class="graph_loading_container" v-show="props.loading">
      <div class="bar loading-1"></div>
      <div class="bar loading-2"></div>
      <div class="bar loading-3"></div>
      <div class="bar loading-4"></div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GraphLoader",
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    fadeType: {
      type: String,
      default: "fade-both"
    }
  }
};
</script>

<style scoped lang="scss">
.graph_loading_container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  display: flex;
  min-height: 175px;
  width: 100%;
  height: 100%;
  flex-direction: row;
  background-color: #fff;
  text-align: center;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.2s;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 120px;
  width: 160px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
}
.bar {
  height: 10px;
  width: 25px;
  display: inline-block;
  margin: 90px 2px 0 0;
  background-color: #66cfc3;
  border-radius: 2px 2px 0 0;
  animation: loading-chart-chat 1s infinite;

  &.loading-1 {
    animation-delay: 0.11s;
  }
  &.loading-2 {
    animation-delay: 0.25s;
  }
  &.loading-3 {
    animation-delay: 0.37s;
  }
  &.loading-4 {
    animation-delay: 0.5s;
  }
}

@keyframes loading-chart-chat {
  0% {
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  50% {
    height: 100px;
    margin-top: 0px;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
