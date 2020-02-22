<template>
  <div class="drag_handle" @mousedown="startDrag($event)"></div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "ResizePane",
  data: function() {
    return {
      dragging: false,
      startWidth: 400,
      startPosition: 0
    };
  },
  props: {
    dragParent: {
      type: HTMLDivElement
    },
    identifier: {
      type: String,
      default: ""
    },
    minWidth: {
      type: Number,
      default: 400
    },
    maxWidth: {
      type: Number,
      default: 9999
    }
  },
  methods: {
    ...mapActions(["updatePreferences"]),
    mouseMove(e) {
      if (this.dragging == true) {
        e.preventDefault();

        let adjustedWidth = this.startWidth - (this.startPosition - e.clientX);

        if (adjustedWidth >= this.minWidth && adjustedWidth <= this.maxWidth) {
          this.dragParent.setAttribute("style", `width: ${adjustedWidth}px`);
        }

        this.dragging = true;
      }
    },
    mouseUp() {
      document.querySelector("body").classList.remove("no_select");

      this.dragging = false;

      document.removeEventListener("mousemove", this.mouseMove);
      document.removeEventListener("mouseup", this.mouseUp);

      let payload = {
        dragging: {}
      };

      payload["dragging"][this.identifier] = this.dragParent.clientWidth;

      this.updatePreferences(payload);
    },
    startDrag(e) {
      if (e.which == 1) {
        document.querySelector("body").classList.add("no_select");

        this.dragging = true;
        this.startWidth = this.dragParent.clientWidth;
        this.startPosition = e.clientX;

        // Drags an element

        document.addEventListener("mousemove", this.mouseMove);

        // Ends a drag

        document.addEventListener("mouseup", this.mouseUp);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.drag_handle {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 5px;
  z-index: 5;
  cursor: e-resize;
}
</style>
