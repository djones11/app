<template>
  <div :class="`tabs ${mode}`">
    <nav class="main_navigation">
      <ul class="navigation_list">
        <li
          @click="$event.which == 1 ? clickEvent(item, index, $event) : null"
          class="navigation_item"
          v-for="(item, index) in filteredMenuItems"
          :key="item['name']"
        >
          <!-- Change route -->

          <router-link
            tag="span"
            v-if="item['view']"
            class="navigation_item_text"
            :style="{
              color:
                activeItem == index ||
                (typeof activeItem == 'string' &&
                  ((item['name'] &&
                    formattedActiveItem == makeUgly(item['name'], '')) ||
                    (item['id'] &&
                      formattedActiveItem == makeUgly(item['id'], ''))))
                  ? '#66cfc3'
                  : 'inherit'
            }"
            :title="item['name']"
            :to="{ name: item['view'] }"
          >
            <span v-if="item['icon']" :class="`${item['icon']} icon`"></span>
            <span class="text" v-if="mode != 'icons_only'">{{
              item["name"]
            }}</span>
          </router-link>

          <!-- Click button -->

          <span
            class="navigation_item_text"
            :title="item['name']"
            v-if="!item['view']"
            :style="[
              {
                color: isActive(index, item) ? '#66cfc3' : 'inherit'
              },
              getActiveStyle(index, item)
            ]"
          >
            <span
              v-if="item['icon']"
              :class="`${item['icon']} icon`"
              :title="mode == 'icons_only' ? item['name'] : ''"
            >
            </span>
            <span v-if="mode != 'icons_only'" class="text">{{
              item["name"]
            }}</span>
          </span>
        </li>
      </ul>
      <div
        v-if="mode == 'tabbed' && this.activeItem >= 0"
        class="moving_bar"
        :style="{
          'background-color': '#66cfc3',
          width: `${barWidth}%`,
          transform: `translate3d(${barMove}, 0, 0)`
        }"
      ></div>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import makeUgly from "@/mixins/makeUgly.js";

export default {
  name: "TabbedMenu",
  data: function() {
    return {};
  },
  props: {
    menuItems: {
      type: Array,
      default: () => {
        return [];
      }
    },
    activeItem: {
      type: Number | String,
      default: 0
    },
    activeStyle: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      default: "tabbed"
    }
  },
  mixins: [makeUgly],
  computed: {
    ...mapGetters(["getTheme"]),
    filteredMenuItems() {
      return this.menuItems.filter(x => x["show"] !== false);
    },
    formattedActiveItem() {
      return this.makeUgly(this.activeItem, "");
    },
    menuIndex() {
      return this.menuItems.map(x => {
        return x["id"] ? x["id"] : x["name"];
      });
    },
    barWidth() {
      return this.menuItems.length > 0 ? 100 / this.menuItems.length : 0;
    },
    barMove() {
      let _activeItem =
        typeof this.activeItem == "number"
          ? this.activeItem
          : this.menuIndex.indexOf(this.activeItem);

      return `${this.menuItems.length * this.barWidth * _activeItem}%`;
    }
  },
  methods: {
    isActive(index, item) {
      return (
        this.activeItem == index ||
        (typeof this.activeItem == "string" &&
          ((item["name"] &&
            this.formattedActiveItem == this.makeUgly(item["name"], "")) ||
            (item["id"] &&
              this.formattedActiveItem == this.makeUgly(item["id"], ""))))
      );
    },
    getActiveStyle(index, item) {
      return this.isActive(index, item) ? this.activeStyle : {};
    },
    clickEvent(item, index, event) {
      if (item["function"]) {
        item["function"](event);
      }

      this.$emit("click", { index: index, item: item });
    }
  }
};
</script>

<style scoped lang="scss">
.tabs {
  position: relative;
  background-color: inherit;
  flex: 1;

  &.tabbed {
    .navigation_item {
      padding: 0.35em 0;
    }
  }

  &.button,
  &.button_icon {
    color: #fff;

    .navigation_item {
      padding: 0 0.6em;
    }

    .navigation_item_text {
      padding: 7px 0;
      border-radius: 24px;
    }

    .icon {
      top: 0.12em;
    }
  }

  &.button_icon {
    .icon {
      top: 0.1em;
    }
  }

  &.icons_only {
    .navigation_item {
      padding: 0 1em;
    }
  }

  &.dark {
    color: inherit;
  }

  &.button_icon {
    .text {
      display: none;
    }

    .navigation_item {
      flex: initial;
    }

    .navigation_item_text {
      padding: 0.75em 1em;
      border-radius: 50%;
    }
  }

  &.left {
    flex: initial;

    .navigation_list {
      justify-content: flex-start;
    }

    .navigation_item {
      flex: initial;
    }

    .navigation_item_text {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
}
.main_navigation {
  height: 100%;
  text-align: center;
  background-color: inherit;
}
.navigation_list {
  position: relative;
  display: flex;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  flex-flow: row wrap;
  justify-content: space-between;
  background-color: inherit;
  transition: right 0.15s linear;
  flex-wrap: nowrap;
}
.navigation_item {
  background-color: inherit;
  cursor: pointer;
  user-select: none;
}
.navigation_item_text {
  position: relative;
  display: block;
  padding: 9px 0;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.3s, transform 0.3s;
  background-color: inherit;
  text-align: center;

  & /deep/ > .icon {
    top: 0.2em;
  }

  .icon {
    position: relative;
    font-size: 1.1em;

    &.icon-dev {
      font-size: 0.95em;
    }
  }

  .text {
    padding-left: 12px;
  }
}
.navigation_item_text:before {
  font-size: 0.9em;
}
.navigation_item_text:focus {
  outline: none;
}
.navigation_item {
  position: relative;
  display: block;
  margin: 0;
  padding: 0 0.6em;
  text-align: center;
  flex: 1;

  &.hide_text {
    flex: 0.25;
  }
}
.moving_bar {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 400%;
  height: 3px;
  background: $light_green;
  border-radius: 2px;
  transition: transform 0.3s;
}

.no_tab {
  .moving_bar {
    display: none;
  }

  .text {
    font-size: 0.85em;
  }
}

// Vertical theme

.vertical {
  .navigation_list {
    flex-direction: column;
  }
  .navigation_item {
    padding: 0.45em 1.1em;
    font-size: 0.8em;
    text-align: left;
  }
  .navigation_item_text {
    & > * {
      vertical-align: middle;
    }
  }
  .icon {
    font-size: 1.35em;
  }
}
</style>
