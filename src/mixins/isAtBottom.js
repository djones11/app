// Checks if scroll is at bottom of container

export default {
  methods: {
    isAtBottom(selector) {
      let container = this.$el.querySelector(selector);

      return container
        ? container.scrollTop == container.scrollHeight - container.offsetHeight
        : false;
    }
  }
};
