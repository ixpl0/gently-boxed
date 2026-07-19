<template>
  <div class="ui-card">
    <slot />
  </div>
</template>

<style scoped>
/* Nested 3D transforms compose, so one step per element gives uniform levels at any nesting depth */
.ui-card {
  position: relative;
  padding: 24px;

  /* Opaque panel colors derive from the face color via fixed OKLCH lightness offsets */
  background: oklch(from var(--surface-color) calc(l + 0.05) c h);
  border: 1px solid oklch(from var(--surface-color) calc(l + 0.14) c h);
  border-radius: 16px;
  corner-shape: squircle;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;

  /* The darker projection one elevation level down works as a cast shadow */
  &::before {
    position: absolute;
    inset: 0;
    background: oklch(from var(--surface-color) calc(l - 0.04) c h);
    border-radius: inherit;
    corner-shape: inherit;
    transform: translateZ(calc(2px - var(--elevation-step)));
    content: "";
  }
}
</style>
