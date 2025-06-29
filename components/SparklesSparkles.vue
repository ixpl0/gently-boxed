<template>
  <div class="sparkles-sparkles">
    <div
      v-for="i in sparkleCount"
      :key="i"
      class="sparkle"
      :data-type="type"
    >
      <svg
        v-if="type === 'star'"
        viewBox="0 0 122.88 122.88"
        class="sparkle-icon"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M62.43,122.88h-1.98c0-16.15-6.04-30.27-18.11-42.34C30.27,68.47,16.16,62.43,0,62.43v-1.98 c16.16,0,30.27-6.04,42.34-18.14C54.41,30.21,60.45,16.1,60.45,0h1.98c0,16.15,6.04,30.27,18.11,42.34 c12.07,12.07,26.18,18.11,42.34,18.11v1.98c-16.15,0-30.27,6.04-42.34,18.11C68.47,92.61,62.43,106.72,62.43,122.88L62.43,122.88z"
          fill="currentColor"
        />
      </svg>
      <div v-else class="sparkle-shape" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SparkleType = 'cross' | 'star' | 'plus' | 'asterisk' | 'diamond';

interface Props {
  type?: SparkleType;
}

const SPARKLE_COUNTS: Record<SparkleType, number> = {
  cross: 12,
  star: 12,
  plus: 8,
  asterisk: 15,
  diamond: 6,
};

const props = withDefaults(defineProps<Props>(), { type: 'cross' });

const sparkleCount = computed(() => SPARKLE_COUNTS[props.type] ?? 12);
</script>

<style scoped>
.sparkles-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  --duration: 2s;
  position: absolute;
  width: 16px;
  height: 16px;
  color: #fff;
  transform: translate(-50%, -50%);
  animation: sparkle var(--duration) infinite;
}

.sparkle-icon {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px #ffffff4c);
}

.sparkle-shape {
  position: relative;
  width: 100%;
  height: 100%;
  animation: sparkle-scale var(--duration) infinite;

  &::before,
  &::after {
    position: absolute;
    border: 0 solid #fff;
    box-shadow: 0 0 4px #fff, 0 0 8px #ffffff4c;
    content: "";
  }

  &::before {
    top: 0;
    left: calc((10px - 2px) / -2);
    width: 10px;
    height: 0;
    border-top-width: 2px;
  }

  &::after {
    top: calc((14px - 2px) / -2);
    left: 0;
    width: 0;
    height: 14px;
    border-left-width: 2px;
  }
}

.sparkle[data-type="plus"] {
  .sparkle-shape {
    --offset: calc((12px - 2px) / -2);
    --size: 12px;

    &::before {
      left: var(--offset);
      width: var(--size);
    }

    &::after {
      top: var(--offset);
      height: var(--size);
    }
  }
}

.sparkle[data-type="asterisk"] {
  .sparkle-shape {
    &::before,
    &::after {
      transform-origin: center;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}

.sparkle[data-type="diamond"] {
  .sparkle-shape {
    --size: 8px;
    --offset: calc(50% - 4px);

    &::before {
      top: var(--offset);
      left: var(--offset);
      width: var(--size);
      height: var(--size);
      border: 2px solid #fff;
      border-radius: 0;
      transform: rotate(45deg);
    }

    &::after {
      display: none;
    }
  }
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: calc(var(--duration) * 0 / 12);
}

.sparkle:nth-child(2) {
  top: 20%;
  left: 70%;
  animation-delay: calc(var(--duration) * 1 / 12);
}

.sparkle:nth-child(3) {
  top: 70%;
  left: 10%;
  animation-delay: calc(var(--duration) * 2 / 12);
}

.sparkle:nth-child(4) {
  top: 80%;
  left: 80%;
  animation-delay: calc(var(--duration) * 3 / 12);
}

.sparkle:nth-child(5) {
  top: 50%;
  left: 5%;
  animation-delay: calc(var(--duration) * 4 / 12);
}

.sparkle:nth-child(6) {
  top: 40%;
  left: 90%;
  animation-delay: calc(var(--duration) * 5 / 12);
}

.sparkle:nth-child(7) {
  top: 90%;
  left: 30%;
  animation-delay: calc(var(--duration) * 6 / 12);
}

.sparkle:nth-child(8) {
  top: 70%;
  left: 60%;
  animation-delay: calc(var(--duration) * 7 / 12);
}

.sparkle:nth-child(9) {
  top: 30%;
  left: 95%;
  animation-delay: calc(var(--duration) * 8 / 12);
}

.sparkle:nth-child(10) {
  top: 30%;
  left: 40%;
  animation-delay: calc(var(--duration) * 9 / 12);
}

.sparkle:nth-child(11) {
  top: 10%;
  left: 50%;
  animation-delay: calc(var(--duration) * 10 / 12);
}

.sparkle:nth-child(12) {
  top: 55%;
  left: 45%;
  animation-delay: calc(var(--duration) * 11 / 12);
}

.sparkle:nth-child(13) {
  top: 60%;
  left: 25%;
  animation-delay: calc(var(--duration) * 12 / 15);
}

.sparkle:nth-child(14) {
  top: 85%;
  left: 65%;
  animation-delay: calc(var(--duration) * 13 / 15);
}

.sparkle:nth-child(15) {
  top: 25%;
  left: 15%;
  animation-delay: calc(var(--duration) * 14 / 15);
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
