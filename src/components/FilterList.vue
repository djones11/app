<template>
  <ul class="filter_list">
    <SynButton
      class="synthetix"
      v-for="item in list"
      :key="item['id']"
      @click="$emit('remove', item['id'])"
      :style="{
        'background-color': item['colour'] ? item['colour'] : '#5f6d7a',
        'border-color': item['colour'] ? item['colour'] : '#5f6d7a'
      }"
      :buttonText="
        `<span>${item['text']}</span> <span class='icon icon-cross3'></span>`
      "
    />
    <SynButton
      class="ghost dark"
      @click="$emit('remove')"
      buttonText="<span>All</span> <span class='icon icon-cross3'></span>"
      v-if="list.length > 1"
    />
  </ul>
</template>

<script>
import SynButton from "@/components/input/SynButton.vue";

export default {
  name: "FilterList",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SynButton
  }
};
</script>

<style scoped lang="scss">
.filter_list {
  padding-top: 12px;

  & /deep/ > * {
    padding: 0 12px 12px 0;
  }

  & /deep/ .button_container {
    padding: 2px 6px 2px 10px;
  }

  & /deep/ .icon {
    padding: 1px 0 0 4px;
    font-size: 1.1em !important;
  }
}
</style>
