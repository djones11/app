<template>
  <div
    class="slide_container"
    :style="{
      width: `calc(100% / ${numberOfElements})`,
      transform: `translateX(${
        !firstMove ? '0%' : secondMove ? '-200%' : '-100%'
      })`
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "SlideContainer",
  props: {
    firstMove: Boolean,
    secondMove: Boolean,
    numberOfElements: {
      type: Number,
      default: 3
    }
  }
};
</script>

<style scoped lang="scss">
.slide_container {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  transition: all 0.25s ease-in-out;
  background-color: inherit;

  & /deep/ > * {
    white-space: initial;
  }
}
</style>
