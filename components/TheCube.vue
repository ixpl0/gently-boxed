<template>
  <div class="cube-wrapper">
    <div class="cube-pivot">
      <div
        class="bounds-plane"
        aria-hidden="true"
      />

      <div
        class="cube"
        :data-side="side"
      >
        <div
          class="side front"
          :inert="side !== 'front'"
        >
          <SparklesSparkles
            v-if="side === 'front'"
            type="star"
          />
          <slot name="front">
            <UiText>
              incredible
            </UiText>
          </slot>
        </div>

        <div
          class="side back"
          :inert="side !== 'back'"
        >
          <SparklesSparkles
            v-if="side === 'back'"
            type="cross"
          />
          <slot name="back">
            <UiText>
              unbelievable
            </UiText>
          </slot>
        </div>

        <div
          class="side left"
          :inert="side !== 'left'"
        >
          <SparklesSparkles
            v-if="side === 'left'"
            type="plus"
          />
          <slot name="left">
            <UiText>
              amazing
            </UiText>
          </slot>
        </div>

        <div
          class="side right"
          :inert="side !== 'right'"
        >
          <SparklesSparkles
            v-if="side === 'right'"
            type="asterisk"
          />
          <slot name="right">
            <UiText>
              fantastic
            </UiText>
          </slot>
        </div>

        <div
          class="side top"
          :inert="side !== 'top'"
        >
          <SparklesSparkles
            v-if="side === 'top'"
            type="diamond"
          />
          <slot name="top">
            <UiText>
              magnificent
            </UiText>
          </slot>
        </div>

        <div
          class="side bottom"
          :inert="side !== 'bottom'"
        >
          <SparklesSparkles
            v-if="side === 'bottom'"
            type="cross"
          />
          <slot name="bottom">
            <UiText>
              wonderful
            </UiText>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SideType } from '~/utils/sides';

defineProps<{
  side: SideType;
}>();
</script>

<style scoped>
.cube-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  perspective: 1000px;
}

/* Hosts the cube and the bounds plane at a fixed shared depth */
.cube-pivot {
  position: relative;
  transform: translateZ(-250px);
  transform-style: preserve-3d;
}

/* An invisible oversized backdrop that pins the 3D scene's projected bounds:
   the compositor sizes its render surface by projected content, so without this
   the surface regrows mid-spin (the silhouette is widest around 45deg) and the
   freshly allocated tiles can flash garbage. Deep enough to never split planes
   with the swept cube corners */
.bounds-plane {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1600px;
  height: 1600px;
  background: #0a0a0a05;
  transform: translate(-50%, -50%) translateZ(-500px);
  pointer-events: none;
}

.cube {
  position: relative;
  width: 500px;
  height: 500px;
  transition: transform 2.1s;
  user-select: none;
  transform-style: preserve-3d;

  /* A permanent compositor layer: promoting it mid-spin flashes garbage GPU tiles */
  will-change: transform;

  &[data-side="back"] {
    transform: rotateY(-180deg) rotateZ(90deg);
  }

  &[data-side="left"] {
    transform: rotateY(90deg) rotateX(180deg);
  }

  &[data-side="right"] {
    transform: rotateY(-90deg) rotateX(90deg);
  }

  &[data-side="top"] {
    transform: rotateX(-90deg) rotateY(90deg);
  }

  &[data-side="bottom"] {
    transform: rotateX(90deg) rotateY(180deg);
  }
}

.side {
  --elevation-step: 25px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 45px;
  background-color: #000;

  /* TEMPORARY diagnostic: flat collapses each face's subtree into a single
     texture, disabling all elevation — restore preserve-3d to bring it back */
  transform-style: flat;

  /* The cube is a closed convex solid, so hidden backfaces are always occluded anyway;
     skipping them halves the surfaces the compositor rasterizes during a spin */
  backface-visibility: hidden;

  &.front {
    --surface-color: #3973cc;
    background: var(--surface-color);
    transform: translateZ(250px);
  }

  &.back {
    --surface-color: #e05a5a;
    background: var(--surface-color);
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
  }

  &.left {
    --surface-color: #e09c36;
    background: var(--surface-color);
    transform: rotateY(-90deg) rotateZ(180deg) translateZ(250px);
  }

  &.right {
    --surface-color: #36b374;
    background: var(--surface-color);
    transform: rotateY(90deg) rotateZ(-90deg) translateZ(250px);
  }

  &.top {
    --surface-color: #36b0c2;
    background: var(--surface-color);
    transform: rotateX(90deg) rotateZ(90deg) translateZ(250px);
  }

  &.bottom {
    --surface-color: #9b6bc2;
    background: var(--surface-color);
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(250px);
  }
}

</style>
