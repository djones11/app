<template>
  <div
    v-if="userInformation['preferences']"
    v-show="status"
    :class="{
      dragging: dragging
    }"
    class="draggable_container"
  >
    <header
      @mousedown="startDrag"
      :style="{
        'background-color': getTheme['leftBar-backgroundColour']
      }"
      class="draggable_header"
    >
      <slot name="header"></slot>
      <span
        title="Close"
        :style="{
          color: getTheme['leftBar-fontColour']
        }"
        @mousedown="closeDraggable($event)"
        class="icon icon-cross4 close_draggable hover"
      ></span>
    </header>
    <slot name="body"></slot>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

// The majority of the operation of this component exists outside of the Vue framework for improved dragging performance

export default {
  name: "DraggableBox",
  data: function() {
    return {
      dragging: false,
      draggingHeight: 0,
      draggingWidth: 0,
      left: 0,
      top: 0,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      resizeListener: null
    };
  },
  props: {
    identifier: String
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeListener);
  },
  computed: {
    ...mapState(["userInformation"]),
    status() {
      let status = false;

      if (this.userInformation["preferences"]["drag_box"][this.identifier]) {
        status = this.userInformation["preferences"]["drag_box"][
          this.identifier
        ]["status"];
      }

      return status;
    }
  },
  methods: {
    ...mapActions(["updatePreferences"]),
    setPosition(left = this.left, top = this.top) {
      this.$el.setAttribute(
        "style",
        `transform: translate(${left}px, ${top}px)`
      );
    },
    closeDraggable(e) {
      if (e.which == 1) {
        e.stopPropagation();
        this.updateDragPreferences(false);
      }
    },
    updateDragPreferences(status = this.status) {
      let dragData = {
        x: `${this.left}px`,
        y: `${this.top}px`,
        status: status
      };
      let data = {};

      data["drag_box"] = this.userInformation["preferences"]["drag_box"]
        ? this.userInformation["preferences"]["drag_box"]
        : {};

      data["drag_box"][this.identifier] = dragData;

      this.updatePreferences(data);
    },
    startDrag(e) {
      if (e.which == 1) {
        document.getElementById("body").classList.add("no_select");

        this.dragging = true;
        this.$el = this.$el;

        let rect = this.$el.getBoundingClientRect();
        let xOffset = rect.left;
        let yOffset = rect.top;
        let dragX = e.clientX;
        let dragY = e.clientY;
        let left = e.clientX - (dragX - xOffset);
        let top = e.clientY - (dragY - yOffset);

        // Drags an element

        let handleMouseMove = e => {
          if (this.dragging == true) {
            e.preventDefault();

            // Drag limits

            let bottomLimit =
              this.draggingHeight - (dragY - yOffset) + e.clientY;
            let topLimit = e.clientY - (dragY - yOffset);
            let rightLimit = this.draggingWidth - (dragX - xOffset) + e.clientX;
            let leftLimit = e.clientX - (dragX - xOffset);

            if (rightLimit < this.screenWidth && leftLimit > 0) {
              left = e.clientX - (dragX - xOffset);
            }

            if (bottomLimit < this.screenHeight && topLimit > 0) {
              top = e.clientY - (dragY - yOffset);
            }

            this.setPosition(left, top);
          }
        };

        // Ends a drag

        let handleMouseUp = () => {
          document.getElementById("body").classList.remove("no_select");

          this.left = left;
          this.top = top;
          this.dragging = false;
          this.updateDragPreferences();

          document.removeEventListener("mouseup", handleMouseUp);
          document.removeEventListener("mousemove", handleMouseMove);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    }
  },
  watch: {
    status: {
      immediate: true,
      handler(newval) {
        if (newval) {
          this.$nextTick(() => {
            let dragBoxConfig = this.userInformation["preferences"]["drag_box"][
              this.identifier
            ];

            this.draggingWidth = this.$el.clientWidth;
            this.draggingHeight = this.$el.clientHeight;

            this.left = dragBoxConfig["x"]
              ? dragBoxConfig["x"].slice(0, -2)
              : 0;
            this.top = dragBoxConfig["y"] ? dragBoxConfig["y"].slice(0, -2) : 0;

            this.setPosition();

            // Moves the draggable containers in if they would be off the screen

            this.resizeListener = () => {
              if (this.$el) {
                this.screenWidth = window.innerWidth;
                this.screenHeight = window.innerHeight;

                let rect = this.$el.getBoundingClientRect();
                let xOffset = rect.left;
                let yOffset = rect.top;

                let resizePosX = xOffset + this.draggingWidth;
                let resizePosY = yOffset + this.draggingHeight;

                if (resizePosX > this.screenWidth) {
                  this.left = this.screenWidth - this.draggingWidth;
                }

                if (resizePosY > this.screenHeight && yOffset > 0) {
                  this.top = this.screenHeight - this.draggingHeight;
                }

                this.setPosition();
              }
            };

            window.addEventListener("resize", this.resizeListener);
          });
        } else {
          window.removeEventListener("resize", this.resizeListener);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.draggable_container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 15;
  display: flex;
  width: 335px;
  height: 280px;
  flex-direction: column;
  overflow: hidden;
  border-radius: 6px;
  opacity: 1;
  background-color: #fff;
  box-shadow: 1px 1px 4px 0px rgba(95, 109, 122, 0.75);
  transition: opacity 0.15s linear;

  &.dragging {
    opacity: 0.5;

    .draggable_header {
      cursor: grabbing;
      cursor: -webkit-grabbing;
    }
  }
}
.draggable_header {
  display: flex;
  padding: 0 8px;
  min-height: 40px;
  border: 1px solid #fff;
  border-bottom: 0px;
  border-radius: 6px 6px 0 0;
  color: #fff;
  font-size: 14px;
  align-items: center;
  cursor: move;
  cursor: grab;
  cursor: -webkit-grab;

  & /deep/ .icon:not(.close_draggable) {
    padding-right: 12px;
  }
}
.close_draggable {
  position: absolute;
  right: 16px;
  font-size: 18px;
  cursor: pointer;
}
</style>
