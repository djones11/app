<template>
  <div
    class="form_frame checkbox_container"
    :class="{
      active: isChecked
    }"
  >
    <div class="toggle_container">
      <input
        class="form_input"
        :type="newType == undefined ? 'radio' : newType"
        :name="name"
        :id="`${id ? id : msg}_${_uid}`"
        @click="outputFunction($event)"
        :value="value"
        :checked="isChecked"
      />
    </div>
    <label
      class="syn_radio_label"
      :for="`${id ? id : msg}_${_uid}`"
      v-html="makePretty(msg, false)"
    ></label>
  </div>
</template>

<script>
import makePretty from "@/mixins/makePretty.js";

export default {
  name: "FormInputCheckbox",
  data: function() {
    return {
      newType: this.type
    };
  },
  props: {
    msg: String,
    type: String,
    name: String,
    id: String,
    value: String | Number
  },
  model: {
    prop: "output"
  },
  mixins: [makePretty],
  computed: {
    identifier() {
      return Math.random() + "_" + this.msg;
    },
    isChecked() {
      if (this.newType == "checkbox") {
        return typeof this.$attrs["output"] == "undefined"
          ? false
          : this.$attrs["output"];
      } else {
        return this.$attrs["output"] == this.value ? true : false;
      }
    }
  },
  methods: {
    outputFunction(event) {
      event.stopPropagation();

      let val = event.target;
      let _val = this.newType == "checkbox" ? val.checked : val.value;

      this.$emit("click", event);
      this.$emit("input", _val);
    }
  }
};
</script>

<style scoped lang="scss">
.form_frame {
  position: relative;
  display: flex;
  width: 100%;
}
.toggle_container {
  display: inline-block;
}
.syn_radio_label {
  position: relative;
  margin: 0;
  padding: 4px 0 4px 32px;
  display: block;
  clear: both;
  float: left;
  font-size: 1em;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
}
.form_input {
  position: absolute;
  top: 50%;
  left: 6px;
  width: 16px;
  height: 16px;
  margin: 0;
  transform: translateY(-50%);
  cursor: pointer;
  outline: none;
  background-color: #fefefe;
  border-radius: 50%;
  border: 1px solid $dark_blue;
  appearance: none;

  &:checked {
    background-color: #66cfc3;
  }
}

// Square theme

.square {
  .syn_radio_label {
    padding: 0 4px 0 0;
    line-height: 1.6em;
  }

  .toggle_container {
    padding-right: 1em;
  }

  .form_input {
    position: relative;
    display: block;
    width: 1.1em;
    height: 1.1em;
    margin: 0 auto;
    padding: 0;
    background-color: $pale_blue;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 13px;
    border-radius: 2px;

    &:checked {
      background-image: url("../../../public/assets/images/icon_checked.svg");
      background-size: 0.6em;
      background-color: #fff;
    }
  }
}

// Inline

.inline {
  &.form_frame {
    padding-right: 12px;
  }
}

// Login theme

.login_theme {
  .syn_radio_label {
    color: $light_text_colour;
  }
  .form_input {
    left: 0;
    width: 22px;
    height: 22px;
  }
}

// Toggle theme

.toggle {
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  padding: 18px 0;

  &.active {
    .toggle_container {
      &:before {
        left: 18px;
      }
    }
  }

  .syn_radio_label {
    position: relative;
    padding: 0;
    flex: 0.5;
    align-items: center;
  }
  .toggle_container {
    position: relative;
    height: 25px;
    margin: 0px auto;
    flex: 1;

    &:before {
      content: "";
      position: absolute;
      display: block;
      left: -2px;
      z-index: 1;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.3);
      background-color: $very_light_blue;
      pointer-events: none;
    }
  }
  .form_input {
    left: 0;
    width: 40px;
    height: 25px;
    background: #fff;
    border: 3px solid $very_light_blue;
    border-radius: 50px;
    background-color: $light_red;
    transition: all 0.3s ease;
    box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.5),
      0px 1px 0px rgba(255, 255, 255, 0.2);

    &:checked {
      background-color: $green;
    }
  }
}

.mob,
.tablet {
  .toggle {
    display: block;

    .syn_radio_label {
      padding-bottom: 10px;
    }

    & > * {
      width: 100%;
    }
  }
}

// Large button theme

.large_toggle {
  .form_input {
    width: 22px;
    height: 22px;
  }
  .syn_radio_label {
    padding-left: 38px;
  }
}
</style>
