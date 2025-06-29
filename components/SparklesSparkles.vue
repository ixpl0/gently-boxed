<template>
  <div class="sparkles-sparkles">
    <div
      v-for="(sparkle, index) in sparkles"
      :key="`sparkle-${index}`"
      class="sparkle"
      :data-type="type"
      :style="{
        top: sparkle.top,
        left: sparkle.left,
        animationDelay: sparkle.delay,
        animationDuration: `${duration}s`
      }"
      @animationiteration="() => updateSparklePosition(index)"
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
import {
  computed,
  onMounted,
  ref,
} from 'vue';

type SparkleType = 'cross' | 'star' | 'plus' | 'asterisk' | 'diamond';

interface SparkleData {
  top: string;
  left: string;
  delay: string;
}

interface Props {
  type?: SparkleType;
  duration?: number;
  count?: number;
}

const SPARKLE_COUNTS: Record<SparkleType, number> = {
  cross: 12,
  star: 12,
  plus: 8,
  asterisk: 15,
  diamond: 6,
};

const POSITION_RANGE = {
  min: 10,
  max: 90,
};

const props = withDefaults(defineProps<Props>(), {
  type: 'cross',
  duration: 2,
  count: 0,
});

const sparkleCount = computed(() => props.count || SPARKLE_COUNTS[props.type] || 12);
const sparkles = ref<SparkleData[]>([]);

const generateRandomPosition = (index: number, total: number): SparkleData => ({
  top: `${Math.random() * (POSITION_RANGE.max - POSITION_RANGE.min) + POSITION_RANGE.min}%`,
  left: `${Math.random() * (POSITION_RANGE.max - POSITION_RANGE.min) + POSITION_RANGE.min}%`,
  delay: `${(props.duration * index) / total}s`,
});

const updateSparklePosition = (index: number): void => {
  const sparkle = sparkles.value[index];

  if (!sparkle) {
    return;
  }

  const newPosition = generateRandomPosition(index, sparkles.value.length);

  sparkle.top = newPosition.top;
  sparkle.left = newPosition.left;
};

const initializeSparkles = (): void => {
  const count = sparkleCount.value;

  sparkles.value = Array.from({ length: count }, (_, index) => (
    generateRandomPosition(index, count)
  ));
};

onMounted(initializeSparkles);
</script>

<style scoped>
.sparkles-sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 16px;
  height: 16px;
  color: #fff;
  transform: translate(-50%, -50%);
  animation: sparkle infinite;
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

.sparkle[data-type="plus"] .sparkle-shape {
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

.sparkle[data-type="asterisk"] .sparkle-shape {
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

.sparkle[data-type="diamond"] .sparkle-shape {
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

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
