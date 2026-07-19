<template>
  <div class="ui-layer">
    <slot />
  </div>
</template>

<style scoped>
/* Lifts slotted content one elevation level above the parent surface */
.ui-layer {
  transform: translateZ(var(--elevation-step));
  transform-style: preserve-3d;
}
</style>
