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
  baseX: number;
  baseY: number;
}

interface Props {
  type?: SparkleType;
  duration?: number;
  count?: number;
}

const POSITION_MIN = 0;
const POSITION_MAX = 100;
const RANDOM_OFFSET_RANGE = 5;
const OFFSET_MULTIPLIER = 2;
const HALF_DIVISOR = 0.5;
const DEFAULT_DURATION = 2;
const DEFAULT_FALLBACK_COUNT = 12;
const MAX_PARTICLES = 12;

const SPARKLE_COUNTS: Record<SparkleType, number> = {
  cross: 10,
  star: 12,
  plus: 8,
  asterisk: 8,
  diamond: 6,
} as const;

const SPARKLE_POSITIONS_BASE = [
  {
    x: 20,
    y: 10,
  },
  {
    x: 70,
    y: 20,
  },
  {
    x: 10,
    y: 70,
  },
  {
    x: 80,
    y: 80,
  },
  {
    x: 5,
    y: 50,
  },
  {
    x: 90,
    y: 40,
  },
  {
    x: 30,
    y: 90,
  },
  {
    x: 60,
    y: 70,
  },
  {
    x: 95,
    y: 30,
  },
  {
    x: 40,
    y: 30,
  },
  {
    x: 50,
    y: 10,
  },
  {
    x: 45,
    y: 55,
  },
  {
    x: 25,
    y: 60,
  },
  {
    x: 65,
    y: 85,
  },
  {
    x: 15,
    y: 25,
  },
] as const;

const props = withDefaults(defineProps<Props>(), {
  type: 'cross',
  duration: DEFAULT_DURATION,
  count: 0,
});

const sparkles = ref<SparkleData[]>([]);

const sparkleCount = computed(() => {
  const requestedCount = props.count || SPARKLE_COUNTS[props.type] || DEFAULT_FALLBACK_COUNT;

  return Math.min(requestedCount, MAX_PARTICLES);
});

const getRandomOffset = (): number => (
  (Math.random() - HALF_DIVISOR) * OFFSET_MULTIPLIER * RANDOM_OFFSET_RANGE
);

const clampPosition = (value: number): number => (
  Math.max(POSITION_MIN, Math.min(POSITION_MAX, value))
);

const getPosition = (index: number): typeof SPARKLE_POSITIONS_BASE[number] => {
  return SPARKLE_POSITIONS_BASE[index % SPARKLE_POSITIONS_BASE.length] as typeof SPARKLE_POSITIONS_BASE[number];
};

const createSparkleData = (index: number, position: typeof SPARKLE_POSITIONS_BASE[number]): SparkleData => {
  const offsetX = getRandomOffset();
  const offsetY = getRandomOffset();
  const x = clampPosition(position.x + offsetX);
  const y = clampPosition(position.y + offsetY);

  return {
    top: `${y}%`,
    left: `${x}%`,
    delay: `${(props.duration * index) / sparkleCount.value}s`,
    baseX: position.x,
    baseY: position.y,
  };
};

const updateSparklePosition = (index: number): void => {
  const sparkle = sparkles.value[index];

  if (!sparkle) {
    return;
  }

  const offsetX = getRandomOffset();
  const offsetY = getRandomOffset();
  const newX = clampPosition(sparkle.baseX + offsetX);
  const newY = clampPosition(sparkle.baseY + offsetY);

  sparkle.top = `${newY}%`;
  sparkle.left = `${newX}%`;
};

const initializeSparkles = (): void => {
  const count = sparkleCount.value;

  sparkles.value = Array.from({ length: count }, (_, index) => {
    const position = getPosition(index);

    return createSparkleData(index, position);
  });
};

onMounted(initializeSparkles);
</script>

<style scoped>
.sparkles-sparkles {
  --sparkle-size: 16px;
  --sparkle-glow-blur: 4px;
  --sparkle-glow-spread: 8px;
  --fade-in-duration: 0.1s;
  --cross-line-width: 2px;
  --cross-horizontal-length: 10px;
  --cross-vertical-length: 14px;
  --plus-size: 12px;
  --diamond-size: 8px;
  --rotation-45-deg: 45deg;
  --rotation-minus-45-deg: -45deg;
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: var(--sparkle-size);
  height: var(--sparkle-size);
  color: #fff;
  opacity: 0;
  transform: translate(-50%, -50%);
  animation: sparkle infinite, fade-in var(--fade-in-duration) ease-out forwards;
}

.sparkle-icon {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 var(--sparkle-glow-blur) #fff) drop-shadow(0 0 var(--sparkle-glow-spread) #ffffff4c);
}

.sparkle-shape {
  position: relative;
  width: 100%;
  height: 100%;

  &::before,
  &::after {
    position: absolute;
    border: 0 solid #fff;
    box-shadow: 0 0 var(--sparkle-glow-blur) #fff, 0 0 var(--sparkle-glow-spread) #ffffff4c;
    content: "";
  }

  &::before {
    top: 0;
    left: calc((var(--cross-horizontal-length) - var(--cross-line-width)) / -2);
    width: var(--cross-horizontal-length);
    height: 0;
    border-top-width: var(--cross-line-width);
  }

  &::after {
    top: calc((var(--cross-vertical-length) - var(--cross-line-width)) / -2);
    left: 0;
    width: 0;
    height: var(--cross-vertical-length);
    border-left-width: var(--cross-line-width);
  }
}

.sparkle[data-type="plus"] .sparkle-shape {
  --offset: calc((var(--plus-size) - var(--cross-line-width)) / -2);
  --size: var(--plus-size);

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
    transform: rotate(var(--rotation-45-deg));
  }

  &::after {
    transform: rotate(var(--rotation-minus-45-deg));
  }
}

.sparkle[data-type="diamond"] .sparkle-shape {
  --size: var(--diamond-size);
  --offset: calc(50% - 4px);

  &::before {
    top: var(--offset);
    left: var(--offset);
    width: var(--size);
    height: var(--size);
    border: var(--cross-line-width) solid #fff;
    border-radius: 0;
    transform: rotate(var(--rotation-45-deg));
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

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
