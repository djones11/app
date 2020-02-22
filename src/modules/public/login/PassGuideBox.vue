<template>
  <div class="passguide_wrapper">
    <transition name="move-up">
      <div class="passguide_box" v-show="active && $mq == 'desktop'">
        <ul>
          <li>
            <h4>Your password must</h4>
          </li>
          <li
            class="pass_criteria"
            :class="{ success: passwordValidator['minLength']['result'] }"
          >
            <span class="icon icon-circle-check"></span>
            <p>Contain at least 8 characters</p>
          </li>
          <li
            class="pass_criteria"
            :class="{ success: passwordValidator['upperCase']['result'] }"
          >
            <span class="icon icon-circle-check"></span>
            <p>
              Contain at least 1 capital letter
            </p>
          </li>
          <li
            class="pass_criteria"
            :class="{ success: passwordValidator['lowerCase']['result'] }"
          >
            <span class="icon icon-circle-check"></span>
            <p>
              Contain at least 1 lowercase letter
            </p>
          </li>
          <li
            class="pass_criteria"
            :class="{ success: passwordValidator['number']['result'] }"
          >
            <span class="icon icon-circle-check"></span>
            <p>Contain at least 1 number</p>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PassGuideBox",
  data: function() {
    return {};
  },
  props: {
    passwordValidator: {
      type: Object,
      default: () => {
        return {};
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped lang="scss">
.passguide_wrapper {
  position: absolute;
  top: 100%;
  left: 20px;
}
.passguide_box {
  position: absolute;
  z-index: 4;
  color: #44515b;
  border-radius: 4px;
  box-sizing: content-box;
  white-space: initial;

  * {
    vertical-align: middle;
  }

  ul {
    position: relative;
    width: 250px;
    height: auto;
    margin: 0 auto;
    padding: 10px 6px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 1px 1px 13px -1px rgba(0, 0, 0, 0.3);

    &:before {
      content: "";
      position: absolute;
      top: -11px;
      left: 20px;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 7px solid #ffffff;
      transform: rotate(-90deg);
    }
  }

  li {
    list-style: none;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 4px 8px;
  }
}
li.pass_criteria {
  p {
    width: calc(100% - 40px);
    display: inline-block;
    clear: none;
    padding-bottom: 0;
  }

  .icon {
    width: 40px;
    display: inline-block;
    font-size: 30px;
    color: #e4e4e4;
    padding-right: 8px;
    cursor: default;
  }

  &.success .icon {
    color: #66cfc3;
  }
}

// Positioned to the left

.left {
  &.passguide_wrapper {
    top: 0;
  }

  .passguide_box {
    ul {
      &:before {
        top: 16px;
        left: auto;
        right: -1px;
        border-bottom: 7px solid #fff;
        border-left: 8px solid transparent;
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
