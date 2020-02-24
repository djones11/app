<template>
  <div class="form_input_container">
    <label
      v-if="showLabel || (msg && showLabel)"
      for="msg"
      class="form_label"
      >{{ makePretty(msg) }}</label
    >
    <div
      class="input_wrapper"
      :class="{
        show_send_icon: sendIcon['type'] || clear,
        show_additional:
          additional && Object.keys(additional).length > 0 && newOutput
      }"
    >
      <!-- Additional -->

      <div
        class="additional_container"
        v-if="additional && Object.keys(additional).length > 0 && newOutput"
        @click="additional['event']($event)"
      >
        <span
          :class="`icon additional_icon ${additional['icon']}`"
          v-if="additional['icon']"
        ></span>
        <span>{{ additional["title"] }}</span>
      </div>

      <!-- Text box -->

      <input
        v-if="textTypes.indexOf(newType) != -1 || !newType"
        :tabIndex="tab"
        :id="$vnode.key ? $vnode.key : msg"
        :type="newType == undefined ? 'text' : newType"
        v-model="outputFunction"
        @keydown="
          applyMask($event);
          $emit('keydown', $event);
        "
        @keyup="$emit('keyup', $event)"
        @focus="$emit('focus', $event)"
        ref="inputField"
        @click="$event.stopPropagation()"
        @blur="$emit('blur', $event)"
        :maxlength="maxlength ? maxlength : undefined"
        :placeholder="computedPlaceholder"
        class="form_input form_input_text"
      />

      <!-- Buttons -->

      <span
        :title="sendIcon['type'] == 'submit' ? 'Submit' : ''"
        v-if="
          (sendIcon['type'] == 'submit' && newOutput) ||
            (sendIcon['type'] == 'search' && !newOutput)
        "
        @click="$emit('submit', $event)"
        :class="`${sendIcon['icon']} icon hover send_icon`"
      ></span>
      <span
        v-if="
          (type == 'password' || showEye == true) &&
            newOutput &&
            newOutput.length > 0
        "
        :class="{
          'icon-eye3': showEye == false,
          'icon-eye-slash': showEye == true
        }"
        @click="togglePassword()"
        class="toggle_password icon"
      ></span>
      <span
        class="clear_field icon"
        v-if="
          msg &&
            newType == 'text' &&
            msg.indexOf('search') != -1 &&
            (!newOutput || newOutput.length == 0)
        "
      ></span>
      <span
        title="Clear input"
        class="clear_field icon icon-cross4 hover"
        @click="clearInput()"
        v-if="newType != 'textarea' && clear == true"
        v-show="newOutput && newOutput.length > 0"
      ></span>
    </div>
  </div>
</template>

<script>
import makePretty from "@/mixins/makePretty.js";
import formatDate from "@/mixins/formatDate.js";
import validator from "@/mixins/validator.js";

export default {
  name: "FormInputField",
  data: function() {
    return {
      showEye: false,
      newType: this.type,
      newOutput: this.output,
      debounceTimeout: null,
      textTypes: ["text", "email", "password"],
      alwaysAllowedKeys: [8, 46, 37, 39, 4, 6],
      blurUpdateTimeout: null,
      selectedDate: null
    };
  },
  mixins: [makePretty, formatDate, validator],
  props: {
    validateConfig: Object,
    msg: String,
    type: {
      type: String,
      default: "text"
    },
    tab: String,
    output: String | Object,
    showLabel: Boolean,
    maxlength: Number | String,
    inputMask: String | RegExp,
    additional: {
      type: Object,
      default: () => {
        return {};
      }
    },
    remaining: {
      type: Number,
      default: 0
    },
    debounce: {
      type: Number,
      default: 0
    },
    sendIcon: {
      type: Object,
      default: () => {
        return {};
      }
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: false
    },
    emitOnEnter: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    manualUpdate: Number | String
  },
  model: {
    prop: "output"
  },
  mounted() {
    this.$emit("ref", this.$refs.inputField);
  },
  computed: {
    maxDate() {
      let today = new Date();
      return new Date().setDate(today.getDate() - 1);
    },
    identifier() {
      return Math.random() + "_" + this.msg;
    },
    outputFunction: {
      get() {
        return (this.newOutput = this.output);
      },
      set(val) {
        this.updateOutput(val);
      }
    },
    inputMaskPresets() {
      let result = this.inputMask;

      switch (result) {
        case "numbers":
          result = /^\d+/;
          break;
      }

      return result;
    },
    computedPlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      } else if (!this.showLabel) {
        return this.makePretty(this.msg);
      } else {
        return "";
      }
    }
  },
  methods: {
    updateOutput(val) {
      clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(() => {
        if (this.validateConfig) {
          this.validator(val, this.validateConfig);
        }

        this.newOutput = val;
        this.$emit("input", val);
      }, this.debounce);
    },
    applyMask(event) {
      let key = event.key;

      // Needs some work to prevent copy and pasting when incorrect

      if (this.inputMaskPresets) {
        if (
          this.alwaysAllowedKeys.indexOf(event.which) == -1 &&
          !this.inputMaskPresets.test(key) &&
          event.ctrlKey == false
        ) {
          event.preventDefault();
        }
      }
    },
    togglePassword: function() {
      this.showEye = !this.showEye;

      if (this.newType == "password") {
        this.newType = "text";
      } else {
        this.newType = "password";
      }
    },
    clearInput: function() {
      this.newOutput = "";
      this.$emit("input", this.newOutput);
    }
  },
  watch: {
    manualUpdate() {
      this.$emit("input", this.$refs["contentEditable"].innerHTML);
    }
  }
};
</script>

<style scoped lang="scss">
.form_input_container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6px 0;
}
input[type="password"] {
  padding-right: 32px;
}
.input_wrapper {
  position: relative;
  height: 100%;

  &.show_send_icon .form_input {
    padding-right: 2.5em;
  }

  .icon:not(.additional_icon) {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;

    &.toggle_password {
      right: 37px;
    }
  }

  .additional_container {
    position: absolute;
    right: 1.25em;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;

    & > * {
      opacity: 0.75;
    }

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      bottom: 3px;
      width: 1px;
      background-color: $normal_text_colour;
    }
  }

  &.show_additional {
    .form_input {
      padding-right: 12em;
    }

    .clear_field {
      right: 10em !important;
    }

    .additional_container {
      &:hover > * {
        opacity: 1;
      }
    }

    .icon {
      padding: 0 10px 0 12px;
    }
  }
}
.form_input {
  width: 100%;
  outline: none;
  background: none;
  font-size: 1em;
  color: inherit;
  transition: padding 0.15s ease-in-out;
}
.form_label {
  display: inline-block;
  padding-bottom: 6px;
  font-size: 0.95em;
}

// Classic theme

.classic {
  .form_input::-webkit-input-placeholder {
    color: #c5d0de;
  }
  .form_input:-moz-placeholder {
    color: #c5d0de;
  }
  .form_input::-moz-placeholder {
    color: #c5d0de;
  }
  .form_input:-ms-input-placeholder {
    color: #c5d0de;
  }
  .form_input {
    display: block;
    width: 100%;
    padding: 0.25em 1em;
    clear: both;
    outline: none;
    background-color: #ffffff;
    color: $normal_text_colour;
    font-size: 1em;
    border: 2px solid $very_light_blue;
    border-radius: 30px;
  }
  &:not(.chat_input) {
    .form_input:focus {
      border-color: $dark_blue;
    }
  }
  .input_wrapper .clear_field,
  .input_wrapper .send_icon {
    right: 1em;
  }
  .icon {
    color: $black;
  }
}

// Inline label

.inline {
  &.form_input_container {
    display: flex;
    padding: 18px 0;
    justify-content: space-between;
    align-items: top;

    & > .form_label {
      padding: 5px 12px 5px 0;
      flex: 0.5;
      font-size: 1em;
    }

    & > .input_wrapper {
      flex: 1;
    }
  }
}

// On dark background theme

.dark {
  .form_input {
    background-color: none;
    color: #fff;
  }
  .form_input::-webkit-input-placeholder {
    color: #fff;
  }
  .form_input:-moz-placeholder {
    color: #fff;
  }
  .form_input::-moz-placeholder {
    color: #fff;
  }
  .form_input:-ms-input-placeholder {
    color: #fff;
  }
}

// Login input theme

.login_theme {
  .form_input {
    width: 100%;
    padding: 8px 30px;
    font-size: 1.4em;
    font-weight: 400;
    text-align: center;
    border-bottom: 5px solid $light_text_colour;
    color: $light_text_colour;
    transition: all 100ms ease-in-out;
  }
  .form_input:focus {
    text-align: left;
    padding: 8px 60px 8px 0px;
    border-bottom-color: $light_green;
  }
  .input_wrapper > .icon {
    color: $light_text_colour;

    &:hover {
      color: #fff;
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
  .chat_input {
    .form_input {
      border-right: 0;
      border-bottom: 0;
      border-radius: 0;
    }
  }
}
</style>
