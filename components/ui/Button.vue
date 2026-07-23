<template>
  <button class="ui-button">
    <slot />
  </button>
</template>

<style scoped>
/* A bare text action: no panel, no border — the padding only keeps a comfortable
   hit area, and hover answers with an accent tint plus the usual elevation lift */
.ui-button {
  position: relative;
  padding: 10px 24px;
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  background: none;
  border: 0;
  border-radius: 10px;
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: oklch(from var(--side-accent) 82% calc(c * 0.6) h);
    transform: translateZ(calc(var(--elevation-step) + 10px));
  }
}
</style>
