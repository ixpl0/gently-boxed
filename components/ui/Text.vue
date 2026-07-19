<template>
  <div class="ui-text">
    <div
      class="ui-text-shadow"
      aria-hidden="true"
    >
      <slot />
    </div>

    <slot />
  </div>
</template>

<style scoped>
/* Lifts text content one elevation level above the parent surface */
.ui-text {
  position: relative;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
}

/* A copy of the content projected down; text-fill-color repaints every glyph in the exact system shadow color */
.ui-text-shadow {
  position: absolute;
  inset: 0;
  transform: translateZ(calc(2px - var(--elevation-step)));
  pointer-events: none;
  -webkit-text-fill-color: oklch(from var(--surface-color) calc(l - 0.04) c h);
}
</style>
