<template>
  <UiText>
    <h2 class="ui-title">
      <slot />
    </h2>
  </UiText>
</template>

<style scoped>
/* Face headings take a pastel tint of the side accent, like the reference's colored titles */
.ui-title {
  margin: 0;
  color: oklch(from var(--side-accent) 82% calc(c * 0.6) h);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}
</style>
