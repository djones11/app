<template>
  <transition :name="fadeTransition">
    <div
      v-click-outside="hide"
      :class="`action_box ${mode} ${$mq}`"
      v-bind:style="mousePosition"
      v-if="visibility == true"
    >
      <!-- List type -->

      <template v-if="mode == 'list'">
        <ul class="action_wrap">
          <li
            title=""
            v-for="(list_item, index) in availableListOptions"
            :key="list_item['id'].replace('{{index}}', index)"
            class="action_list_item"
            :style="list_item['style']"
          >
            <label
              class="action_list_item_inner_container"
              :class="{ active: list_item['class'] }"
              @click="
                $event.which == 1 && list_item['function']
                  ? clickEvent(list_item, $event, index)
                  : null
              "
            >
              <span
                v-if="list_item['icon']"
                :class="`icon ${list_item['icon']}`"
              ></span>
              <span>
                {{ list_item["name"] }}
                <small class="subtext" v-if="list_item['subtext']">{{
                  list_item["subtext"]
                }}</small>
              </span>
              <input
                v-if="list_item['file']"
                @change="
                  hide();
                  list_item['changeFunction']($event);
                "
                type="file"
                id="upload_attachment"
                multiple
              />
              <span
                v-if="list_item['children']"
                class="icon icon-chevron-right2 children_icon"
                :class="{
                  open:
                    childrenOpen.indexOf(
                      list_item['id'].replace('{{index}}', index)
                    ) != -1
                }"
              ></span>
            </label>
            <SlideUpDown
              v-if="list_item['children']"
              :active="
                childrenOpen.indexOf(
                  list_item['id'].replace('{{index}}', index)
                ) != -1
              "
              :duration="350"
            >
              <ul class="child_list_container">
                <li
                  class="child_list_item"
                  :class="{
                    child_active: list_item['children']['active']
                  }"
                  @click="
                    list_item['function'](
                      $event,
                      child[list_item['children']['value']]
                    )
                  "
                  v-for="child in convertArrayToObject(
                    list_item['children']['options']
                  )"
                  :key="child[list_item['children']['value']]"
                >
                  <span
                    v-if="
                      list_item['children']['active'] ==
                        child[list_item['children']['value']]
                    "
                    class="child_active_icon icon icon-checkmark3"
                  ></span>
                  <span class="child_text">{{
                    child[list_item["children"]["text"]]
                  }}</span>
                </li>
              </ul>
            </SlideUpDown>
          </li>
        </ul>
        <ul class="action_wrap mobile_close_wrap" v-if="$mq != 'desktop'">
          <li
            class="action_list_item"
            @click="
              $event.stopPropagation();
              $emit('hide');
            "
          >
            <span class="action_list_item_inner_container">Close</span>
          </li>
        </ul>
      </template>

      <!-- Input type -->

      <template v-else-if="mode == 'input'">
        <div @click="$event.stopPropagation()" class="input_type_wrapper">
          <h4 class="input_title">{{ config["title"] }}</h4>
          <FormInputField
            msg="Type here ..."
            v-model="outputFunction"
            :key="config['key']"
            type="text"
            :clear="true"
            :maxlength="25"
            class="synthetix"
          />
          <SubmitContainer
            @submit="
              $emit('click');
              $emit('hide');
            "
            @cancel="$emit('hide')"
          />
        </div>
      </template>

      <!-- Custom type -->

      <template v-else>
        <div @click="$event.stopPropagation()" class="custom_type_wrapper">
          <slot />
        </div>
      </template>
    </div>
  </transition>
</template>

<script>
import ClickOutside from "vue-click-outside";
import { mapGetters } from "vuex";

import SlideUpDown from "@/components/SlideUpDown";
import FormInputField from "@/components/input/FormInputField";
import SubmitContainer from "@/components/SubmitContainer";

export default {
  name: "ActionBox",
  data: function() {
    return {
      childrenOpen: []
    };
  },
  props: {
    visibility: {
      required: true,
      type: Boolean
    },
    config: {
      type: Array | Object,
      default: () => []
    },
    mousePosition: {
      type: Object,
      default: () => {}
    },
    fadeTransition: {
      type: String,
      default: "fade-up"
    },
    mode: {
      type: String,
      default: "list"
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: "output"
  },
  components: {
    SlideUpDown,
    FormInputField,
    SubmitContainer
  },
  directives: {
    ClickOutside
  },
  computed: {
    availableListOptions() {
      return this.config.filter(x => {
        return typeof x["show"] == "undefined" || x["show"];
      });
    },
    outputFunction: {
      get() {
        return this.config["model"];
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    convertArrayToObject(source) {
      if (source) {
        if (typeof source[0] == "string") {
          let _source = [];

          for (let i = 0, len = source.length; i < len; i++) {
            _source.push({
              id: source[i],
              title: source[i]
            });
          }

          return _source;
        } else {
          return source;
        }
      }
    },
    hide() {
      if (this.visibility) {
        this.$emit("hide");
      }
    },
    clickEvent(item, $event, index) {
      if (item["children"]) {
        $event.stopPropagation();

        let index = this.childrenOpen.indexOf(item["id"]);

        if (index != -1) {
          this.$delete(this.childrenOpen, index);
        } else {
          this.childrenOpen.push(item["id"]);
        }
      } else {
        if (item.hasOwnProperty("view")) {
          this.$router.push({
            name: item["view"]
          });
        } else {
          item["function"]($event, item, index, this.params);
        }
      }
    }
  },
  watch: {
    visibility(newval) {
      if (newval) this.childrenOpen = [];
    }
  }
};
</script>

<style scoped lang="scss">
.action_box {
  position: absolute;
  top: calc(100% + 16px);
  z-index: 15;
  width: 250px;
  color: $normal_text_colour;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 1px 13px -1px rgba(0, 0, 0, 0.5);
  user-select: none;
  will-change: top, opacity;
  transform: translateZ(0);

  &.custom {
    width: auto;
  }

  &.top {
    top: auto;
    bottom: calc(100% + 16px);

    &:after {
      top: auto;
      bottom: -10px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-top: 5px solid #fff;
    }
  }

  &:after {
    content: "";
    position: absolute;
    top: -5px;
    left: 22px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #fff;
  }
  &.none {
    &:after {
      border: transparent;
    }
  }
  &.right {
    right: 0;
    left: initial;

    &:after {
      left: auto;
      right: 15px;
    }
  }
  &.center {
    right: -30px;
    left: initial;
    transform: translateX(-50%);

    &:after {
      left: auto;
      right: 10px;
    }
  }
}
.action_wrap {
  height: auto;
  margin: 0 auto;
  padding: 6px 6px 4px 6px;
}
.action_list_item {
  position: relative;
  width: 100%;
  margin: 0 auto;
  list-style: none;
  font-size: 15px;
  background-color: #fff;
  text-align: left;

  &:nth-child(1) {
    border: none;
  }
  .icon {
    display: flex;
    padding: 0px 15px 0 10px;
    align-items: center;
    font-size: 16px;
  }
  * {
    vertical-align: middle;
  }
  .children_icon {
    position: absolute;
    right: 12px;
    top: 50%;
    padding: 0;
    transform: translateY(-50%);
    font-size: 1.1em;
    transition: all 0.25s linear;
    transform-origin: center;

    &.open {
      transform: translateY(-50%) rotate(90deg);
    }
  }
}
.action_list_item_inner_container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 10px;
  cursor: pointer;

  &:hover,
  &.active {
    background-color: $pale_blue;
  }

  &.active {
    &:after {
      content: "\e116";
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-family: "icomoon" !important;
    }
  }
}
.subtext {
  display: block;
  text-align: right;
  padding: 4px 20% 0 0;
  font-size: 0.65em;
}

$child_list_item_height: 34px;

.child_list_container {
  max-height: $child_list_item_height * 5 + 10;
  overflow: auto;
}
.child_list_item {
  position: relative;
  width: 100%;
  height: $child_list_item_height;
  display: flex;
  margin: 2px auto 0 auto;
  padding: 0 16px;
  align-items: center;
  list-style: none;
  background-color: $very_light_blue;
  cursor: pointer;

  &.child_active {
    padding-left: 2.25em;
  }
}
.child_active_icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
}
.input_type_wrapper {
  padding: 12px;
  font-size: 0.9em;
  text-align: center;
  cursor: initial;
}
.custom_type_wrapper {
  width: 100%;
  font-size: 0.9em;
  cursor: initial;
  border-radius: 4px;
  background-color: inherit;

  & /deep/ .button_container {
    margin-left: 20px;
  }
}
.input_title {
  padding-bottom: 4px;
}
.input_button_container {
  display: flex;
  padding-top: 4px;
  justify-content: flex-end;
}
.mobile_close_wrap {
  margin-top: 20px;
}

/*
___  ___      _     _ _      
|  \/  |     | |   (_) |     
| .  . | ___ | |__  _| | ___ 
| |\/| |/ _ \| '_ \| | |/ _ \
| |  | | (_) | |_) | | |  __/
\_|  |_/\___/|_.__/|_|_|\___|
                             
*/

.tablet,
.mob {
  $child_list_item_height: 40px;

  .action_box {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 99999;
    width: 100% !important;
    max-height: 100% !important;
    margin: 0;
    padding-top: 75px;
    background-color: rgba(95, 109, 122, 0.75);
    transform: initial;

    &.custom,
    &.input {
      display: flex;
      padding: 0;
      align-items: center;

      & > *:first-child {
        max-height: 100%;
        width: 100%;
        background-color: #fff;
        border-radius: 0;
      }
    }
  }

  .child_list_container {
    max-height: $child_list_item_height * 5 + 10;
  }

  .child_list_item {
    height: $child_list_item_height;
  }

  .action_wrap {
    width: 80%;
  }
  .action_list_item {
    text-align: center;
    font-size: 18px;

    .icon:not(.children_icon) {
      display: none;
    }
  }

  .action_list_item_inner_container {
    padding: 14px 0;
  }
}
</style>
