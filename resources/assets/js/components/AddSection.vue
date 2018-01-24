<template lang="html">
  <div class="add-section">
    <span class="add-section-button">
      <span>New Section</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'add-section'
}
</script>

<style lang="scss">
.add-section {
  .add-section-button {
    opacity: 0;
    display: block;
    position: relative;
    line-height: 14px;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }

    span {
      position: relative;
      z-index: 1;
      background: #fff;
      padding-right: 5px;
      color: $light-grey-text-color;
      font-size: 0.85em;
    }

    &::after {
      display: block;
      position: absolute;
      content: "";
      border-bottom: 1px dashed $base-border-color;
      left: 0;
      top: 7px;
      width: 100%;
    }
  }
}
</style>
