<template>
  <div class="form_input_container">
    <label v-if="showLabel" for="msg" class="form_label">{{
      makePretty(msg)
    }}</label>
    <div class="slideToggle_wrapper">
      <div
        class="slideToggle"
        :class="{
          checked: newOutput == true,
          unchecked: newOutput != true
        }"
      >
        <input
          type="checkbox"
          :id="identifier"
          class="toggle_button"
          name="notification_checkbox"
          v-model="outputFunction"
          @change="$emit('change', $event)"
        />
        <label :for="identifier" class="form_label"></label>
      </div>
    </div>
  </div>
</template>

<script>
import makePretty from "@/mixins/makePretty.js";

export default {
  name: "ToggleButton",
  data: function() {
    return {
      newOutput: this.output,
      inputTimeout: null
    };
  },
  model: {
    prop: "output"
  },
  props: {
    msg: String,
    output: String | Object,
    showLabel: Boolean
  },
  mixins: [makePretty],
  computed: {
    identifier: function() {
      return Math.random() + "_" + this.msg;
    },
    outputFunction: {
      get() {
        return (this.newOutput = this.output);
      },
      set(val) {
        clearTimeout(this.inputTimeout);

        this.inputTimeout = setTimeout(() => {
          this.newOutput = val;
          this.$emit("input", val);
        }, 100);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.form_input_container {
  position: relative;

  & > * {
    vertical-align: middle;
  }
}
.form_label {
  padding-right: 20px;
}
.slideToggle_wrapper {
  display: inline-block;
  width: 40px;
  height: 26px;
  position: relative;
}
.slideToggle {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 40px;
  height: 25px;
  background: #fff;
  border: 3px solid #c5cfde;
  margin: 0px auto;
  border-radius: 50px;
  transition: all 0.3s ease;
  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.5),
    0px 1px 0px rgba(255, 255, 255, 0.2);
}
.slideToggle.checked {
  background-color: #55ca67;
}
.slideToggle.unchecked {
  background-color: #f77e7e;
}
.slideToggle label {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.3s ease;
  cursor: pointer;
  position: absolute;
  top: -3px;
  left: -5px;
  z-index: 1;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.3);
  background-color: #c5cfde;
}
.slideToggle input:checked + label {
  left: 14px;
}
</style>
