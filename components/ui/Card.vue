<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<style scoped>
.ui-card {
  padding: 20px;
  background: rgb(255 255 255 / 10%);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
  backdrop-filter: blur(7px);
}
</style>
