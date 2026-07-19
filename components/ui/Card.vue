<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<style scoped>
/* Nested 3D transforms compose, so one step per element gives uniform levels at any nesting depth */
.ui-card {
  padding: 20px;
  background: linear-gradient(160deg, rgb(255 255 255 / 18%), rgb(255 255 255 / 6%));
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 8px;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
}
</style>
