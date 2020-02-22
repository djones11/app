<template>
  <div class="accordion_wrapper">
    <div
      class="accordion_header"
      :class="{ selected: refOpen }"
      @click="toggleAccordion()"
    >
      <h4 class="accordion_header_text" v-html="header"></h4>
      <div class="icon_container" v-if="allowOpen">
        <span class="icon icon-chevron-right2" v-if="!loading"></span>
        <Loader class="inline small_loader" v-else :loading="loading" />
      </div>
    </div>
    <SlideUpDown
      class="accordion_section"
      :active="refOpen && !loading"
      :duration="150"
    >
      <div class="accordian_inner_container">
        <slot></slot>
      </div>
    </SlideUpDown>
    <span
      class="preview_text"
      v-if="(previewText && !refOpen) || loading"
      v-html="previewText"
    ></span>
  </div>
</template>

<script>
import SlideUpDown from "./SlideUpDown.vue";

import Loader from "@/components/Loader.vue";

export default {
  name: "Accordion",
  data: function() {
    return {
      refOpen: this.open
    };
  },
  props: {
    header: String,
    previewText: {
      type: String,
      default: ""
    },
    open: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    allowOpen: {
      default: true,
      type: Boolean
    }
  },
  components: {
    SlideUpDown,
    Loader
  },
  methods: {
    toggleAccordion() {
      if (!this.loading && this.allowOpen) {
        this.refOpen = !this.refOpen;
        this.$emit("open", this.refOpen);
      }
    }
  },
  computed: {
    newOpen() {
      return this.open;
    }
  },
  watch: {
    newOpen() {
      this.refOpen = this.newOpen;
    }
  }
};
</script>

<style scoped lang="scss">
.accordion_wrapper {
  display: block;
  width: 100%;
  margin: 0 auto;
  padding: 0 1%;
  border-radius: inherit;
}
.accordion_header {
  position: relative;
  display: block;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
  cursor: pointer;
  user-select: none;

  & .icon_container {
    font-size: 1.4em;
    position: absolute;
    right: 18px;
    top: 18px;
    transform: rotate(0);
    transition: all 250ms ease-in-out;
  }
  &.selected .icon_container {
    transform: rotate(90deg);
  }
}
.accordion_header_text {
  max-width: 90%;
  padding-left: 12px;
}
.accordion_section {
  width: 100%;
  margin: 0 auto;
  transition: all 0.2s linear;
}
.accordian_inner_container {
  padding-bottom: 10px;
}
.preview_text {
  display: inline-block;
  padding: 0 0 18px 12px;
}

// Indent

.indent {
  .accordian_inner_container {
    padding: 0 0 18px 12px;
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
  .accordion_header {
    padding: 20px 0;
  }
}
</style>
