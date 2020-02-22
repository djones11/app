// Equivalent of jquery $on and $off

export default {
  methods: {
    on(el, type, handler) {
      el.addEventListener(type, handler);
    },
    off(el, type, handler) {
      el.removeEventListener(type, handler);
    },
    liveOn(event, selector, callback, context) {
      this.on(context || document, event, function(e) {
        var found,
          el = e.target || e.srcElement;
        while (
          el &&
          el.matches &&
          el !== context &&
          !(found = el.matches(selector))
        )
          el = el.parentElement;
        if (found) callback.call(el, e);
      });
    },
    liveOff(event, selector, callback, context) {
      this.off(context || document, event, function(e) {
        var found,
          el = e.target || e.srcElement;
        while (
          el &&
          el.matches &&
          el !== context &&
          !(found == el.matches(selector))
        )
          el = el.parentElement;
        if (found) callback.call(el, e);
      });
    }
  }
};
