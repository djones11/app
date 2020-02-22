<template>
  <div
    v-show="
      (scrollTop > 50 || alwaysOn == true) && ($mq == mediaView || !mediaView)
    "
    v-bind:style="{ bottom: bottom + 'px' }"
    class="scroll_top_container hover_button"
    @click="scrollToTop()"
  >
    <span class="icon icon-arrow-up3"></span>
  </div>
</template>

<script>
export default {
  name: "ScrollToTopButton",
  data: function() {
    return {
      scrollTop: 1
    };
  },
  props: {
    container: HTMLElement,
    bottom: {
      default: 16,
      type: Number | String
    },
    duration: {
      default: 250,
      type: Number | String
    },
    alwaysOn: {
      default: false,
      type: Boolean | String
    },
    mediaView: {
      default: "mob",
      type: Boolean | String
    }
  },
  deactivated() {
    if (this.container) {
      this.container.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    handleScroll() {
      this.scrollTop = this.container.scrollTop;
    },
    scrollToTop() {
      if (this.duration === 0) {
        this.container.scrollTop = 0;
        return Promise.resolve();
      }

      var start_time = Date.now();
      var end_time = start_time + this.duration;

      var start_top = this.container.scrollTop;
      var distance = 0 - start_top;

      var smooth_step = function(start, end, point) {
        if (point <= start) {
          return 0;
        }
        if (point >= end) {
          return 1;
        }
        var x = (point - start) / (end - start);
        return x * x * (3 - 2 * x);
      };

      return new Promise((resolve, reject) => {
        var previous_top = this.container.scrollTop;
        var scroll_frame = () => {
          if (this.container.scrollTop != previous_top) {
            reject("interrupted");
            return;
          }

          var now = Date.now();
          var point = smooth_step(start_time, end_time, now);
          var frameTop = Math.round(start_top + distance * point);

          this.container.scrollTop = frameTop;

          if (now >= end_time) {
            resolve();
            return;
          }

          if (
            this.container.scrollTop === previous_top &&
            this.container.scrollTop !== frameTop
          ) {
            resolve();
            return;
          }

          previous_top = this.container.scrollTop;
          setTimeout(scroll_frame, 0);
        };

        setTimeout(scroll_frame, 0);
      }).catch(() => {});
    }
  },
  watch: {
    container(newval) {
      if (this.alwaysOn == false) {
        if (newval) {
          this.container.addEventListener("scroll", this.handleScroll, {
            passive: true
          });
        } else {
          this.container.removeEventListener("scroll", this.handleScroll);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.scroll_top_container {
  position: fixed;
  left: 12px;
  z-index: 1;
  font-size: 20px;
}
</style>
