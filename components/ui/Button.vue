<template>
  <button
    class="ui-button"
    @click.stop="(event) => $emit('click', event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.ui-button {
  position: relative;
  padding: 10px 24px;
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;

  /* Opaque panel colors derive from the face color via fixed OKLCH lightness offsets */
  background: oklch(from var(--surface-color) calc(l + 0.07) c h);
  border: 1px solid oklch(from var(--surface-color) calc(l + 0.16) c h);
  border-radius: 10px;
  corner-shape: squircle;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
  transition: all 0.2s;
  cursor: pointer;

  /* The darker projection one elevation level down works as a cast shadow */
  &::before {
    position: absolute;
    inset: 0;
    background: oklch(from var(--surface-color) calc(l - 0.04) c h);
    border-radius: inherit;
    corner-shape: inherit;
    transform: translateZ(calc(2px - var(--elevation-step)));
    transition: all 0.2s;
    content: "";
  }

  &:hover {
    background: oklch(from var(--surface-color) calc(l + 0.11) c h);
    border-color: oklch(from var(--surface-color) calc(l + 0.22) c h);
    transform: translateZ(calc(var(--elevation-step) + 10px));

    /* The projection stays on the surface while the button lifts */
    &::before {
      transform: translateZ(calc(2px - var(--elevation-step) - 10px));
    }
  }
}
</style>
