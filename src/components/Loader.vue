<template functional>
  <transition
    :name="
      data.staticClass && data.staticClass.includes('inline')
        ? ''
        : props.fadeType
    "
  >
    <div
      :class="[
        data.staticClass,
        data.class,
        {
          loading_container: props.loading === undefined
        }
      ]"
      v-show="props.loading || props.loading == undefined"
    >
      <div :class="[data.staticClass, data.class]">
        <span class="loading5" :class="[data.staticClass, data.class]">
          <span class="outerCircle"></span>
        </span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Loader",
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
.loading5 {
  position: absolute;
  top: 0%;
  left: 0%;
  display: flex;
  min-width: 25px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  align-items: center;
  background-color: inherit;

  .outerCircle {
    display: block;
    margin: 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border-top: 4px solid transparent;
    border-bottom: 4px solid #66cfc3;
    border-left: 4px solid #66cfc3;
    border-right: 4px solid transparent;
    animation: cwSpin 0.666s linear 0.2s infinite;
  }

  &.large_loader {
    margin-top: -1%;

    .outerCircle {
      width: 80px;
      height: 80px;
      border-width: 6px;
    }
  }

  &.small_loader {
    .outerCircle {
      width: 25px;
      height: 25px;
    }
  }

  &.very_small_loader {
    .outerCircle {
      width: 20px;
      height: 20px;
    }
  }

  &.tiny_loader {
    .outerCircle {
      width: 15px;
      height: 15px;
      border-width: 3px;
    }
  }

  &.inline {
    position: relative;
    transform: initial;

    .outerCircle {
      position: relative;
    }
  }
}

@keyframes cwSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes ccwSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
