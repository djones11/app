<template functional>
  <span :title="props.status" :class="`${props.status} availability_icon icon`">
  </span>
</template>

<script>
export default {
  name: "AvailabilityIcon",
  props: {
    status: String
  }
};
</script>

<style scoped lang="scss">
.availability_icon {
  position: relative;
  display: inline-block;
  font-size: 0.9em;

  &.Offline:before,
  &.offline:before {
    content: "\f10c";
  }

  &.Online:before,
  &.online:before,
  &.Available:before,
  &.available:before {
    content: "\f111";
    color: $green;
  }

  &.Suspended:before,
  &.suspended:before,
  &.Away:before,
  &.away:before {
    content: "\f10c";
    color: $light_orange;
  }
  &.Suspended:after,
  &.suspended:after,
  &.Away:after,
  &.away:after {
    content: "Z";
    position: absolute;
    top: -4px;
    right: -4px;
    color: $light_orange;
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-size: 0.6em;
    font-weight: 800;
  }
}
</style>
