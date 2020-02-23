<template>
  <div class="colour_wrapper" ref="colorpicker">
    <div
      class="current_color"
      :style="{
        'background-color': colorValue
      }"
      @click="togglePicker()"
    ></div>
    <ChromePicker
      :value="colors"
      @input="updateFromPicker"
      v-if="displayPicker"
    />
    <div class="input_container">
      <p class="colour_header">{{ header }}</p>
      <input
        type="text"
        class="hex_input"
        v-model="colorValue"
        @click="showPicker()"
        @input="updateFromInput"
      />
    </div>
  </div>
</template>

<script>
import { Chrome } from "vue-color";

export default {
  name: "ColourPicker",
  data() {
    return {
      colors: {
        hex: "#000000"
      },
      colorValue: "",
      displayPicker: false,
      colourDebounce: null
    };
  },
  props: {
    color: {
      type: String,
      default: "#000000"
    },
    header: {
      type: String,
      defaukt: ""
    }
  },
  components: {
    ChromePicker: Chrome
  },
  mounted() {
    this.setColor(this.color || "#000000");
  },
  methods: {
    setColor(color) {
      this.updateColors(color);
      this.colorValue = color;
    },
    updateColors(color) {
      if (color.slice(0, 1) == "#") {
        this.colors = {
          hex: color
        };
      } else if (color.slice(0, 4) == "rgba") {
        var rgba = color.replace(/^rgba?\(|\s+|\)$/g, "").split(","),
          hex =
            "#" +
            (
              (1 << 24) +
              (parseInt(rgba[0]) << 16) +
              (parseInt(rgba[1]) << 8) +
              parseInt(rgba[2])
            )
              .toString(16)
              .slice(1);
        this.colors = {
          hex: hex,
          a: rgba[3]
        };
      }
    },
    showPicker() {
      document.addEventListener("click", this.documentClick);
      this.displayPicker = true;
    },
    hidePicker() {
      document.removeEventListener("click", this.documentClick);
      this.displayPicker = false;
    },
    togglePicker() {
      this.displayPicker ? this.hidePicker() : this.showPicker();
    },
    updateFromInput() {
      this.updateColors(this.colorValue);
    },
    updateFromPicker(color) {
      this.colors = color;

      if (color.rgba.a == 1) {
        this.colorValue = color.hex;
      } else {
        this.colorValue = `rgba('${color["rgba"]["r"]}, ${color["rgba"]["g"]}, ${color["rgba"]["b"]}, ${color["rgba"]["a"]})`;
      }
    },
    documentClick(e) {
      var el = this.$refs.colorpicker,
        target = e.target;
      if (el !== target && !el.contains(target)) {
        this.hidePicker();
      }
    }
  },
  watch: {
    colorValue(newval) {
      if (newval && newval && newval != this.color) {
        this.updateColors(newval);

        clearTimeout(this.colourDebounce);

        this.colourDebounce = setTimeout(() => {
          this.$emit("input", newval);
        }, 50);
      }
    },
    color(newval) {
      this.colorValue = newval;
    }
  }
};
</script>

<style scoped lang="scss">
.colour_wrapper {
  position: relative;
  display: inline-block;
  white-space: nowrap;

  & > * {
    vertical-align: top;
  }

  & /deep/ .vc-chrome {
    position: absolute;
    left: 100%;
    top: 0;
    z-index: 1;
  }
}
.input_container {
  display: inline-block;
  padding: 0 12px;
  white-space: initial;
}
.colour_header {
  display: block;
  padding-top: 0;
  font-size: 0.75em;
}
.hex_input {
  display: block;
  border: 0;
  padding: 4px;
  width: 90px;
  font-size: 0.9em;
  color: #232323;
  text-align: right;
  background-color: #f2f2f2;
}
.current_color {
  display: inline-block;
  width: 48px;
  height: 48px;
  border-radius: 7px;
  border: 1px solid $light_grey;
  cursor: pointer;
}
</style>
