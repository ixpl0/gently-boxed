<template>
  <span class="ui-badge">
    <slot />
  </span>
</template>

<style scoped>
.ui-badge {
  display: inline-block;
  margin: 0 8px;
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
  background: rgb(255 255 255 / 10%);
  border-radius: 4px;
  backdrop-filter: blur(2px);
}
</style>
