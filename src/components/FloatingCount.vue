<template functional>
  <small
    class="message_count_container"
    :class="[
      {
        large_number: props.count > 9
      },
      data.staticClass,
      data.class
    ]"
    v-if="props.count"
  >
    {{ props.count }}
  </small>
</template>

<script>
export default {
  name: "FloatingCount",
  props: {
    count: String | Number
  }
};
</script>

<style scoped lang="scss">
.message_count_container {
  position: absolute;
  top: -0.25em;
  right: -0.6em;
  z-index: 1;
  min-width: 1.25em;
  min-height: 1.25em;
  padding: 0.1em 0.5em;
  background-color: $light_red;
  color: #fff;
  border-radius: 25px;
  font-size: 0.6em;
  font-weight: 600;
  text-align: center;
  pointer-events: none;

  &.large_number {
    padding: 0.15em 0.35em;
  }
  &.small {
    font-size: 0.4em;
  }
  &.left {
    top: -0.5em;
    left: -0.75em;
    right: auto;
  }
}
</style>
