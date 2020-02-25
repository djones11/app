<template functional>
  <div
    class="button_wrapper"
    :class="[
      data.staticClass,
      data.class,
      {
        icon_emphasis_button: props.icon
      }
    ]"
    :title="props.title"
  >
    <Loader
      v-if="$options.components['Loader']"
      :loading="props.loading"
      class="inline small_loader"
    />
    <div
      class="button_container"
      @click="listeners.click"
      v-if="!props.loading"
      :style="[data.staticStyle, data.style]"
      :class="{
        disabled: props.disabled
      }"
    >
      <div class="icon_emphasis_button_container" v-if="props.icon">
        <div class="icon_container">
          <span :class="`icon ${props.icon}`"></span>
        </div>
        <button tabindex="-1" class="button" v-html="props.buttonText"></button>
      </div>
      <button
        v-else
        tabindex="-1"
        class="button"
        :class="{
          icon_emphasis: props.icon
        }"
        v-html="props.buttonText"
        :disabled="props.disabled"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    title: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.button_wrapper {
  display: inline-block;
  user-select: none;

  &.no_hover {
    .button_container {
      opacity: 1;
    }
  }
}
.button_container {
  position: relative;
  display: flex;
  width: auto;
  margin: 0 auto;
  padding: 0.25em 1.25em;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 0.9em;
  line-height: 1.2em;
  border: 3px solid $dark_blue;
  background-color: $dark_blue;
  opacity: 0.8;
  outline: none;
  border-radius: 24px;
  overflow: hidden;
  transition: all 100ms ease-in-out;

  &.disabled {
    opacity: 0.35;
  }
  & > * {
    vertical-align: middle;
  }
  &:not(.disabled) {
    cursor: pointer;

    & * {
      cursor: pointer;
    }

    &:hover {
      opacity: 1;
    }
  }
}
.button {
  position: relative;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: inherit;
  font-size: inherit;

  & /deep/ .icon-cross2 {
    padding: 2px 0 0 6px;
  }

  & /deep/ .icon {
    padding-left: 6px;
  }
}

// Icon only

.icon_only {
  font-size: 1.1em;
  justify-content: center;

  .button_container {
    padding: 0.4em;
  }

  & /deep/ .text {
    display: none;
  }

  .button {
    top: 0;
    justify-content: center;

    & /deep/ .icon {
      position: relative;
      left: 0px;
      display: inline-block;
      padding: 0;
    }
  }
}

// No background button

.no_background {
  .button_container {
    background-color: inherit;
    border-width: 0;
    padding: calc(0.25em + 3px) 0;
    color: $normal_text_colour;

    .button {
      font-weight: 600;
    }

    & /deep/ .icon {
      padding-right: 0.5em;
      font-size: 1.1em;
    }
  }
}

// Icon emphasis button

.icon_emphasis_button {
  .button_container {
    padding: 0;
    background: inherit;
    border: 0;
    opacity: 1;
  }

  .icon_emphasis_button_container {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    .button {
      height: 100%;
      padding: 0.55em 1em;
      font-weight: 600;
      background-color: $dark_blue;
      opacity: 0.8;
    }

    .icon_container {
      display: flex;
      padding: 0.1em 0.7em 0 0.9em;
      align-items: center;
      justify-content: center;
      background-color: $dark_blue;

      .icon {
        padding: 0;
        font-size: 1.05em;
      }
    }

    & > * {
      display: inline-block;
      vertical-align: middle;
      flex: 1;
      white-space: nowrap;
    }

    &:hover {
      .button {
        opacity: 1;
      }
    }
  }
}

// Rounded button

.rounded {
  .button_container {
    border-radius: 25px;
  }
}

// Poke

.poke {
  .button_container {
    background-color: $light_orange;
    border-color: $light_orange;
  }
}

// Ghost button

.ghost {
  .button_container {
    background-color: transparent;
    border: 0.15em solid $dark_blue;
    font-weight: 600;
    color: $off_white;
    padding: 0.27em 1.5em;
    opacity: 1;

    &:hover {
      background-color: $off_white;
      color: $black;
    }
  }

  &.dark {
    .button_container {
      background-color: #fff;
      color: $dark_blue;

      &:hover {
        background-color: $dark_blue;
        color: $off_white;
      }
    }

    &.active {
      .button_container {
        background-color: $dark_blue;
        color: $off_white;
      }
    }
  }
}

// Long button

.long {
  .button_container {
    padding: 0.45em 3.5em;
  }
}
</style>
