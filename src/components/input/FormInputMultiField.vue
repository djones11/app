<template>
  <div
    class="form_input_container"
    :class="{
      error: validateConfig && !validateConfig['passed']
    }"
  >
    <label
      :for="$vnode.key ? $vnode.key : msg"
      v-if="showLabel || (msg && showLabel)"
      class="form_label"
      >{{ makePretty(msg, false) }}</label
    >
    <div class="select_container">
      <select
        :disabled="disabled"
        :tabIndex="tab"
        :id="$vnode.key ? $vnode.key : msg"
        v-model="outputFunction"
        class="form_input form_input_text"
      >
        <option
          v-if="noOption"
          :disabled="noOptionDisabled"
          selected
          value=""
          >{{ noOption }}</option
        >
        <option
          :value="option['key']"
          v-for="option in orderedOptions"
          :key="option['key']"
          >{{ option["value"] }}</option
        >
      </select>
      <span class="sort_icon icon icon-sort" v-show="type == 'select'"> </span>
    </div>
  </div>
</template>

<script>
import makePretty from "@/mixins/makePretty.js";
import validator from "@/mixins/validator.js";

export default {
  name: "FormInputMultiField",
  data: function() {
    return {
      newType: this.type,
      newOutput: this.output
    };
  },
  model: {
    prop: "output"
  },
  props: {
    msg: String,
    type: String,
    tab: String,
    output: String | Number,
    noOption: String,
    noOptionDisabled: {
      type: Boolean,
      default: true
    },
    options: Object | Array,
    showLabel: Boolean,
    validateConfig: Object,
    disabled: {
      type: String | Boolean,
      default: false
    },
    sort: {
      type: String | Boolean,
      default: false
    }
  },
  mixins: [makePretty, validator],
  created() {
    if (this.validateConfig) {
      this.validator(this.outputFunction, this.validateConfig);
    }
  },
  computed: {
    identifier: function() {
      return Math.random() + "_" + this.msg;
    },
    outputFunction: {
      get() {
        return (this.newOutput = this.output);
      },
      set(val) {
        if (this.validateConfig) {
          this.validator(val, this.validateConfig);
        }

        this.newOutput = val;
        this.$emit("input", val);
      }
    },
    orderedOptions() {
      let optionArray = [];
      let _options = {};

      if (Array.isArray(this.options)) {
        for (let i = 0, len = this.options.length; i < len; i++) {
          _options[this.options[i]] = this.options[i];
        }
      } else {
        _options = this.options;
      }

      for (let key in _options) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = _options[key];
        let textValue = tmp.innerText;

        optionArray.push({
          key: key,
          value: textValue
        });
      }

      if (this.sort == true) {
        optionArray.sort((a, b) => {
          let textA = a["value"].toUpperCase();
          let textB = b["value"].toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      }

      return optionArray;
    }
  }
};
</script>

<style scoped lang="scss">
.form_input_container,
.select_container {
  position: relative;
  width: 100%;
}
.form_input_container {
  padding: 6px 0;
}
.form_input_container .icon {
  position: absolute;
  right: 1em;
  top: 50%;
  color: $dark_blue;
  transform: translateY(-50%);
}
.form_input[disabled],
.form_input[disabled] + .icon {
  opacity: 0.35;
}
.form_label {
  display: inline-block;
  padding-bottom: 6px;
}

// Classic theme

.synthetix {
  .form_input {
    width: 100%;
    margin: 0 auto;
    padding: 0.25em 2em 0.25em 1em;
    display: block;
    clear: both;
    outline: none;
    background-color: #ffffff;
    color: $normal_text_colour;
    font-size: 1em;
    border: 2px solid $very_light_blue;
    border-radius: 30px;
    appearance: none;
  }
}

// Knowledge theme - like synthetix but borderless and has an opacity

.knowledge {
  .form_input {
    width: 100%;
    margin: 0 auto;
    padding: 0.35em 2em 0.35em 1em;
    display: block;
    clear: both;
    outline: none;
    background-color: #ffffff;
    color: $black;
    font-size: 1em;
    border-radius: 30px;
    appearance: none;
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
      padding: 5px 15px 5px 0;
      flex: 0.5;
      font-size: 1em;
    }

    & > .select_container {
      flex: 1;
    }
  }
}
</style>
