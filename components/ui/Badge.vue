<template>
  <span class="ui-badge">
    <slot />
  </span>
</template>

<style scoped>
.ui-badge {
  position: relative;
  display: inline-block;
  padding: 4px 12px;
  color: #fff;
  font-size: 13px;
  line-height: 1.4;

  /* Opaque panel colors derive from the face color via fixed OKLCH lightness offsets */
  background: oklch(from var(--surface-color) calc(l + 0.09) c h);
  border: 1px solid oklch(from var(--surface-color) calc(l + 0.18) c h);
  border-radius: 999px;
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
