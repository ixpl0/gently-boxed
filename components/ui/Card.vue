<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<style scoped>
/* Nested 3D transforms compose, so one step per element gives uniform levels at any nesting depth */
.ui-card {
  position: relative;
  padding: 20px;
  background: linear-gradient(160deg, rgb(255 255 255 / 18%), rgb(255 255 255 / 6%));
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 8px;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;

  /* Backdrop blur lives on a child overlay: on the card itself it would flatten elevated children */
  &::before {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    backdrop-filter: blur(4px);
    content: "";
  }
}
</style>
