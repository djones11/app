<template functional>
  <li
    :class="[
      `data_field column_number_${props.columnNumber ? props.columnNumber : 2}`,
      data.staticClass,
      data.class
    ]"
    :title="props.title ? props.title : ''"
  >
    <h4 v-html="props.header"></h4>
    <p v-if="props.value != undefined">
      <span
        class="data_value"
        v-html="props.value ? props.value : 'Unknown'"
      ></span>
      <slot class="header_slot" name="header"></slot>
    </p>
    <div class="data_value">
      <slot></slot>
    </div>
  </li>
</template>

<script>
export default {
  name: "DataField",
  props: {
    header: String,
    value: String | Number,
    title: String | Number,
    columnNumber: String | Number
  }
};
</script>

<style scoped lang="scss">
.data_field {
  width: calc(50% - 4px);
  margin: 0 auto;
  display: inline-block;
  padding: 8px 20px 0 0;
  vertical-align: top;
  list-style: none;
  word-wrap: break-word;
  word-wrap: break-all;

  @for $i from 1 through 5 {
    &.column_number_#{$i} {
      width: calc(100% / #{$i} - 4px);
    }
  }
}
.data_value {
  padding: 0;
  margin: 0;

  & /deep/ * {
    vertical-align: middle;
  }

  & /deep/ li {
    list-style: none;
  }
}
.header_slot {
  padding-left: 6px;
}
</style>
