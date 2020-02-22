export default {
  methods: {
    scrollToTop(container, duration = 250, scrollTo) {
      if (duration === 0) {
        container.scrollTop = scrollTo ? scrollTo : 0;
        return Promise.resolve();
      }

      var start_time = Date.now();
      var end_time = start_time + duration;

      var start_top = scrollTo ? scrollTo : container.scrollTop;
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

      return new Promise(resolve => {
        var previous_top = container.scrollTop;
        var scroll_frame = () => {
          var now = Date.now();
          var point = smooth_step(start_time, end_time, now);
          var frameTop = Math.round(start_top + distance * point);

          container.scrollTop = frameTop;

          if (now >= end_time) {
            resolve();
            return;
          }

          if (
            container.scrollTop === previous_top &&
            container.scrollTop !== frameTop
          ) {
            resolve();
            return;
          }

          previous_top = container.scrollTop;
          setTimeout(scroll_frame, 0);
        };

        setTimeout(scroll_frame, 0);
      }).catch(() => {});
    }
  }
};
