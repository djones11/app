<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

import localForage from "localforage";

export default {
  data: function() {
    return {};
  },
  created() {
    localForage.getItem("token", (err, value) => {
      if (value) {
        this.UPDATE_USER_INFORMATION({ token: value });
      }
    });
  },
  methods: {
    ...mapMutations(["UPDATE_USER_INFORMATION"])
  }
};
</script>

<style lang="scss">
body,
html,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
#app {
  color: $normal_text_colour;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  backface-visibility: hidden;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;

  :before,
  :after {
    -webkit-font-smoothing: antialiased;
  }
}
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::-webkit-scrollbar-track {
  background-color: #f3f3f3;
  border-radius: 5px;
}
*::-webkit-scrollbar-thumb {
  background-color: #d9d9de;
  border-radius: 5px;
  border-top: 2px solid #fff;
}
[v-cloak] {
  display: none;
}
input,
button,
textarea {
  outline: none;
  border: none;
  appearance: none;
}
input::-ms-clear {
  display: none;
}
.page {
  height: 100%;
  width: 100%;
}
img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  user-select: none;
  object-fit: contain;
}
h1 {
  font-size: 2.2em;
  font-weight: 400;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h2 {
  font-size: 1.8em;
  font-weight: 400;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h3 {
  font-size: 1.3em;
  font-weight: 600;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h4 {
  font-size: 1.1em;
  font-weight: 600;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h5 {
  font-size: 1.1em;
  font-weight: 400;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h6 {
  font-size: 0.9em;
  font-weight: 600;
  line-height: 1.4em;
  display: block;
  clear: both;
}
h6 {
  font-size: 0.9em;
  font-weight: 600;
  line-height: 1.4em;
  display: block;
  clear: both;
}
p {
  font-size: 0.9em;
  font-weight: 400;
  line-height: 1.4em;
  display: block;
  clear: both;
  padding: 5px 0;
}
a,
.fake_link {
  display: inline-block;
  color: $light_green;
  word-break: break-word;
  text-decoration: underline;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: none;
  }

  .icon {
    padding-right: 0.5em;
  }

  &.hover {
    text-decoration: none;
  }
}
small {
  font-size: 0.7em;
  font-weight: 400;
  line-height: 1.4;
}
text {
  // fill: $normal_text_colour;
}
input[type="file"] {
  display: none;
}
.scroll {
  overflow: auto;
}
.scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.scroll::-webkit-scrollbar-track {
  background-color: #f3f3f3;
  border-radius: 5px;
}
.scroll::-webkit-scrollbar-thumb {
  background-color: #d9d9de;
  border-radius: 5px;
  border-top: 2px solid #fff;
}
.hover {
  opacity: 0.65;
  cursor: pointer;
  user-select: none;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
  }
}
.bold {
  font-weight: 600;
}
.extra_bold {
  font-weight: bold;
}
.syn_link_button {
  margin: 10px auto;
  padding: 0;
  font-size: 1em;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  appearance: none;
  background: none;
  color: $light_text_colour;
  border: none;

  &:hover {
    color: #fff;
  }
}
.hover_button {
  padding: 3px 6px;
  border-radius: 50%;
  box-shadow: 0px 2px 8px -1px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  font-size: 20px;

  &.icon {
    padding: 8px;
  }
}
.syn_ghost_button {
  margin: 0 auto;
  padding: 8px 15px;
  display: inline-block;
  color: #fff;
  font-size: 1.1em;
  border: 3px solid $dark_blue;
  background-color: rgba(0, 0, 0, 0);
  outline: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: all 100ms ease-in-out;

  &:hover {
    color: $very_dark_blue;
    background-color: $light_text_colour;
  }
}
.syn_main_button {
  width: auto;
  margin: 20px 0;
  display: block;
  padding: 6px 15px;
  font-size: 1em;
  font-weight: 600;
  line-height: 1.4em;
  color: #fff;
  opacity: 0.8;
  text-align: center;
  text-decoration: none;
  outline: none;
  background-color: $very_dark_blue;
  border: none;
  appearance: none;
  border-radius: 4px;
  transition: all 100ms ease-in-out;
  cursor: pointer;

  &:hover:not([disabled]) {
    opacity: 1;
  }
  &[disabled] {
    opacity: 0.35;
  }

  &.inverse {
    opacity: 1;
    background-color: #fff;
    color: $very_dark_blue;

    &:hover {
      background-color: $very_dark_blue;
      color: $light_text_colour;
    }
  }
}
.no_results {
  text-align: center;
}
.no_items_container {
  position: relative;
  width: 100%;
  padding: 25% 5%;
  text-align: center;
  opacity: 0.7;

  &.little_spacing {
    padding: 5%;
  }

  &.upper {
    padding: 15% 5%;
  }
  &.no_spacing {
    padding-top: 0;
  }
  &.middle_spacing {
    display: flex;
    height: 100%;
    padding: 0;
    justify-content: center;
    align-items: center;
  }

  h3 {
    font-weight: initial;
  }

  .icon {
    display: inline-block;
    padding-bottom: 12px;
    font-size: 3.25em;
  }
}
.offline_image {
  padding-top: 48px;
  margin: auto;
  max-width: 450px;
  width: 100%;
}

.error_header {
  padding: 18px 0;

  &:first-of-type {
    padding-top: 0;
  }
}
.error_button_wrapper {
  display: flex;
  padding-top: 24px;
  align-items: center;
  justify-content: center;

  .button_wrapper {
    padding: 0 12px;
  }
}

/*
 ___________  ___   _   _  _____ _____ _____ _____ _____ _   _  _____ 
|_   _| ___ \/ _ \ | \ | |/  ___|_   _|_   _|_   _|  _  | \ | |/  ___|
  | | | |_/ / /_\ \|  \| |\ `--.  | |   | |   | | | | | |  \| |\ `--. 
  | | |    /|  _  || . ` | `--. \ | |   | |   | | | | | | . ` | `--. \
  | | | |\ \| | | || |\  |/\__/ /_| |_  | |  _| |_\ \_/ / |\  |/\__/ /
  \_/ \_| \_\_| |_/\_| \_/\____/ \___/  \_/  \___/ \___/\_| \_/\____/ 
                                                                                                                                      
*/

// FADE/MOVE DOWN

.fade-down-leave-active,
.fade-down-enter-active {
  transition: all 0.2s ease-in-out;
}
.fade-down-enter {
  bottom: -100% !important;
  opacity: 0;
}
.fade-down-leave-to {
  opacity: 0;
}

// FADE/MOVE UP

.fade-up-leave-active,
.fade-up-enter-active {
  transition: all 0.2s ease-in-out;
}
.fade-up-enter {
  top: 150px !important;
  opacity: 0;
}
.fade-up-leave-to {
  opacity: 0;
}

// FADE BOTH

.fade-both-enter-active,
.fade-both-leave-active {
  transition: opacity 0.25s;
}
.fade-both-enter,
.fade-both-leave-to {
  opacity: 0;
}

// FADE IN NOT OUT

.fade-in-not-out-enter-active {
  transition: opacity 0.25s;
}
.fade-in-not-out-enter {
  opacity: 0;
}

// FADE OUT NOT IN

.fade-out-not-in-leave-active {
  transition: opacity 0.25s;
}
.fade-out-not-in-leave-to {
  opacity: 0;
}

// MOVE UP

.move-up-enter-active,
.move-up-leave-active {
  transition: all 0.25s;
}
.move-up-enter {
  opacity: 0;
  transform: translateY(200px);
}
.move-up-leave-to {
  opacity: 0;
}

// MOVE DOWN

.move-down-enter-active {
  transition: all 0.5s linear;
  transition-delay: 100ms;
  transition-duration: 0;
}
.move-down-enter {
  opacity: 0;
  transform: translateY(-150%);
}

// MOVE UP NOT OUT

.move-up-not-out-enter-active {
  transition: all 0.35s;
}
.move-up-not-out-enter {
  opacity: 0;
  transform: translateY(400px);
}

// SLIDE RIGHT

.slide-right-leave-active,
.slide-right-enter-active {
  transition: transform 0.25s ease-in-out;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translate(125%, 0);
}

// TADA

.tada-enter-active {
  animation: tada 1s;
}

@keyframes tada {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }

  10%,
  20% {
    -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    -ms-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
  }

  30%,
  50%,
  70%,
  90% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    -ms-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
  }

  40%,
  60%,
  80% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    -ms-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
  }

  100% {
    -webkit-transform: scale3d(1, 1, 1);
    -ms-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

/*
 _     _____  ___ ______ ___________  _____ 
| |   |  _  |/ _ \|  _  \  ___| ___ \/  ___|
| |   | | | / /_\ \ | | | |__ | |_/ /\ `--. 
| |   | | | |  _  | | | |  __||    /  `--. \
| |___\ \_/ / | | | |/ /| |___| |\ \ /\__/ /
\_____/\___/\_| |_/___/ \____/\_| \_|\____/ 
                                            
*/

#syn_loader_box {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: #44515b;
}

.syn_loader {
  position: relative;
  width: 20px;
  height: 20px;
  top: 46%;
  top: calc(50% - 6px);
  left: 46%;
  left: calc(50% - 6px);
  background-color: #e4e4e4;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  -webkit-animation: syn_loader 1s ease-in-out infinite;
  animation: syn_loader 1s ease-in-out infinite;
}

.syn_loader:before {
  content: "";
  position: absolute;
  background-color: #e4e4e4;
  opacity: 0.4;
  top: 0px;
  left: -40px;
  height: 20px;
  width: 20px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.syn_loader:after {
  content: "";
  position: absolute;
  background-color: #e4e4e4;
  opacity: 0.4;
  top: 0px;
  left: 40px;
  height: 20px;
  width: 20px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

@-webkit-keyframes syn_loader {
  0% {
    -webkit-transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(180deg);
  }
}

@keyframes syn_loader {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.loading_container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6;
  width: 100%;
  background-color: inherit;
  overflow: hidden;
}
.passive_loading_container {
  position: absolute;
  right: 15px;
  top: 5px;
  z-index: 1;
  background-color: inherit;

  .small_loader {
    width: 40px;
    height: 40px;
    background-color: inherit;
  }
}

/*
 _   _ _____ _____ ___________ _____ _____   ___ _____ _____ _____ _   _  _____ 
| \ | |  _  |_   _|_   _|  ___|_   _/  __ \ / _ \_   _|_   _|  _  | \ | |/  ___|
|  \| | | | | | |   | | | |_    | | | /  \// /_\ \| |   | | | | | |  \| |\ `--. 
| . ` | | | | | |   | | |  _|   | | | |    |  _  || |   | | | | | | . ` | `--. \
| |\  \ \_/ / | |  _| |_| |    _| |_| \__/\| | | || |  _| |_\ \_/ / |\  |/\__/ /
\_| \_/\___/  \_/  \___/\_|    \___/ \____/\_| |_/\_/  \___/ \___/\_| \_/\____/ 
                                                                                                                                                             
*/

.notifications_container {
  position: fixed;
  right: 20px;
  top: 40px;
  z-index: 50;
  width: 400px;
}
.notifications_list {
  width: 100%;
  margin: 0 auto;
}
.notification {
  position: relative;
  min-height: 85px;
  width: 100%;
  margin: 0 auto 10px auto;
  padding: 15px;
  display: block;
  clear: both;
  overflow: hidden;
  background-color: #fff;
  border-width: 3px;
  border-style: solid;
  border-radius: 10px;
  box-shadow: 1px 2px 8px -1px rgba(0, 0, 0, 0.5);
  animation-duration: 0.5s;

  .notification_text {
    font-size: 0.8em;
    word-wrap: break-word;
    word-wrap: break-all;
  }
}
.notification_message {
  width: 100%;
  height: 100%;
  display: inline-block;
  margin: 0 auto;
  margin-top: -10px;
  padding-right: 60px;
  padding-left: 70px;
  padding-top: 12px;
}
.notification_action {
  position: absolute;
  right: 0px;
  top: 0px;
  display: flex;
  width: 60px;
  height: 100%;
  padding: 2px 2px 2px 0;
  flex-direction: column;

  .notification_button {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7em;
    font-weight: 600;
    color: $very_dark_blue;
    text-decoration: none;
    background-color: #e5e9f1;
    padding: 0;
    line-height: 1.1;
    cursor: pointer;
    transition: all 150ms ease-in-out;
  }
  .notification_button:hover {
    color: #ffffff;
    background-color: #8796a5;
  }
  .notification_button_container {
    list-style: none;
    width: 100%;
    height: 100%;
    display: block;
    flex: 1;
    clear: both;
    padding: 0;
    overflow: hidden;
    text-align: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .notification_button_container:nth-of-type(1) {
    border-top-right-radius: 5px;
    border-bottom: 1px solid #fff;
  }
  .notification_button_container:nth-of-type(2) {
    border-bottom-right-radius: 5px;
    border-top: 1px solid #fff;
  }
}
.notification_note .notification {
  color: $very_dark_blue;
  border-color: #c5d0de;
}

$notification_colours: (
  icon-warning3: $light_red,
  icon-information: $light_orange,
  icon-thumbs-up2: $light_green
);

.notification_icon {
  font-size: 2.8em;
  color: $very_dark_blue;
  position: absolute;
  top: 50%;
  left: 0%;
  width: 60px;
  transform: translate(25%, -50%);

  @each $key, $value in $notification_colours {
    &.#{$key} {
      color: $value;
    }
  }
}
.close_all_notifications {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 0;
  text-align: center;
  background-color: #fff;
  box-shadow: 1px 2px 8px 1px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

/*
______  ___ _____ _____  ______ _____ _____  _   __ ___________ 
|  _  \/ _ \_   _|  ___| | ___ \_   _/  __ \| | / /|  ___| ___ \
| | | / /_\ \| | | |__   | |_/ / | | | /  \/| |/ / | |__ | |_/ /
| | | |  _  || | |  __|  |  __/  | | | |    |    \ |  __||    / 
| |/ /| | | || | | |___  | |    _| |_| \__/\| |\  \| |___| |\ \ 
|___/ \_| |_/\_/ \____/  \_|    \___/ \____/\_| \_/\____/\_| \_|
                                                                
*/

.vc-container {
  box-shadow: 0px 1px 13px -1px rgba(0, 0, 0, 0.5);

  &:after {
    content: "";
    position: absolute;
    top: -5px;
    left: auto;
    right: 22px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #fff;
  }

  .vc-weekday {
    font-size: 0.8em;
    color: $normal_text_colour;
  }
  .vc-title {
    color: $normal_text_colour;

    &.vc-text-lg {
      font-size: 1em;
    }
  }
  .vc-day-content {
    font-size: 0.75em;
    color: #90a1b1;

    &.vc-text-gray-400 {
      opacity: 0.25;
      cursor: initial;

      &:hover {
        background-color: initial;
      }
    }
    &.vc-text-white {
      opacity: 1;
      color: #fff;
    }
  }
  .vc-popover-content {
    background-color: $dark_blue;

    .vc-grid-cell {
      span:hover,
      .vc-bg-gray-100 {
        background-color: $very_dark_blue;
        color: #fff;
      }
    }
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
  .notifications_container {
    right: 5px;
    width: calc(100% - 10px);
  }
}
</style>
