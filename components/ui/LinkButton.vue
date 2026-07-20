<template>
  <a
    class="ui-link-button"
    :href="href"
    :target="opensInNewTab ? '_blank' : undefined"
    :rel="opensInNewTab ? 'noopener noreferrer' : undefined"
    @click.stop
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  href: string;
}>();

// mailto stays in the same tab to trigger the mail client; everything else opens a new tab
const opensInNewTab = computed(() => !props.href.startsWith('mailto:'));
</script>

<style scoped>
.ui-link-button {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;

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

    /* The projection stays on the surface while the link lifts */
    &::before {
      transform: translateZ(calc(2px - var(--elevation-step) - 10px));
    }
  }
}
</style>
