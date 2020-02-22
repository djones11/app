<template>
  <div class="slide_container">
    <slot></slot>
  </div>
</template>

<script>
var DOMAnimations = {
  /**
   * SlideUp
   *
   * @param {HTMLElement} element
   * @param {Number} duration
   * @returns {Promise<boolean>}
   */
  slideUp: function(element, duration = 500) {
    return new Promise(function(resolve) {
      element.style.height = element.offsetHeight + "px";
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + "ms";
      element.offsetHeight;
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      window.setTimeout(function() {
        element.style.display = "none";
        element.style.removeProperty("height");
        element.style.removeProperty("padding-top");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("margin-top");
        element.style.removeProperty("margin-bottom");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
        resolve("closed");
      }, duration);
    });
  },

  /**
   * SlideDown
   *
   * @param {HTMLElement} element
   * @param {Number} duration
   * @returns {Promise<boolean>}
   */
  slideDown: function(element, duration = 500) {
    return new Promise(function(resolve) {
      element.style.removeProperty("display");
      let display = window.getComputedStyle(element).display;

      if (display === "none") display = "block";

      element.style.display = display;
      let height = element.offsetHeight;
      element.style.overflow = "hidden";
      element.style.height = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
      element.style.marginTop = 0;
      element.style.marginBottom = 0;
      element.offsetHeight;
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = duration + "ms";
      element.style.height = height + "px";
      element.style.removeProperty("padding-top");
      element.style.removeProperty("padding-bottom");
      element.style.removeProperty("margin-top");
      element.style.removeProperty("margin-bottom");
      window.setTimeout(function() {
        element.style.removeProperty("height");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition-duration");
        element.style.removeProperty("transition-property");
        resolve("open");
      }, duration);
    });
  },

  /**
   * SlideToggle
   *
   * @param {HTMLElement} element
   * @param {Number} duration
   * @returns {Promise<boolean>}
   */
  slideToggle: function(element, duration = 500) {
    if (window.getComputedStyle(element).display === "none") {
      return this.slideDown(element, duration);
    } else {
      return this.slideUp(element, duration);
    }
  }
};

export default {
  name: "SlideUpDown",
  data: function() {
    return {
      queueCount: 0
    };
  },
  props: {
    active: {
      type: Boolean
    },
    duration: {
      type: Number,
      default: 350
    }
  },
  created() {
    this.$nextTick(() => {
      if (!this.active) {
        DOMAnimations.slideUp(this.$el, 0);
      }
    });
  },
  watch: {
    active() {
      this.queueCount++;

      const queueAnimation = () => {
        DOMAnimations.slideToggle(this.$el, this.duration).then(() => {
          this.queueCount--;

          if (this.queueCount > 0) {
            queueAnimation();
          }
        });
      };

      if (this.queueCount == 1) {
        queueAnimation();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.slide_container {
  background: inherit;
  will-change: margin, padding, height;
  transform: translateZ(0);
}
</style>
