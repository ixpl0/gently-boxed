<template>
  <UiButton
    class="share-button"
    :data-state="state"
    @click="handleShare"
  >
    <span class="share-content">
      <span class="share-icon">
        <svg
          class="share-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="share-line share-line-top"
            d="M8.59 10.49 15.41 6.51"
          />
          <path
            class="share-line share-line-bottom"
            d="M8.59 13.51 15.42 17.49"
          />
          <circle
            class="share-dot share-dot-first"
            cx="18"
            cy="5"
            r="3"
          />
          <circle
            class="share-dot share-dot-second"
            cx="6"
            cy="12"
            r="3"
          />
          <circle
            class="share-dot share-dot-third"
            cx="18"
            cy="19"
            r="3"
          />
          <path
            class="check-mark"
            d="M5 12.8 9.8 17.5 19 7"
          />
        </svg>

        <span
          v-if="isSuccess"
          class="share-burst"
          aria-hidden="true"
        >
          <span class="burst-flash" />
          <span class="burst-ring" />
          <span
            v-for="particle in burstParticles"
            :key="particle.id"
            class="burst-particle"
            :class="particle.isStar ? 'burst-star' : 'burst-dot'"
            :style="particle.style"
          >
            <svg
              v-if="particle.isStar"
              class="burst-star-icon"
              viewBox="0 0 122.88 122.88"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M62.43,122.88h-1.98c0-16.15-6.04-30.27-18.11-42.34C30.27,68.47,16.16,62.43,0,62.43v-1.98 c16.16,0,30.27-6.04,42.34-18.14C54.41,30.21,60.45,16.1,60.45,0h1.98c0,16.15,6.04,30.27,18.11,42.34 c12.07,12.07,26.18,18.11,42.34,18.11v1.98c-16.15,0-30.27,6.04-42.34,18.11C68.47,92.61,62.43,106.72,62.43,122.88L62.43,122.88z"
                fill="currentColor"
              />
            </svg>
          </span>
        </span>
      </span>

      <span class="share-label">Share</span>
    </span>
  </UiButton>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  ref,
} from 'vue';

type ShareState = 'idle' | 'success';

interface BurstParticle {
  id: number;
  isStar: boolean;
  style: Record<string, string>;
}

const PARTICLE_COUNT = 14;
const STAR_MODULO = 2;
const GOLD_MODULO = 3;
const GOLD_COLOR = '#fc0';
const WHITE_COLOR = '#fff';
const DEGREES_PER_CIRCLE = 360;
const DEGREES_TO_RADIANS = Math.PI / 180;
const ANGLE_JITTER_DEGREES = 26;
const MIN_DISTANCE = 26;
const DISTANCE_RANGE = 22;
const MIN_STAR_SIZE = 8;
const STAR_SIZE_RANGE = 5;
const MIN_DOT_SIZE = 3;
const DOT_SIZE_RANGE = 3;
const MIN_DEPTH = 6;
const DEPTH_RANGE = 14;
const SPIN_RANGE_DEGREES = 340;
const BURST_BASE_DELAY_MS = 280;
const DELAY_JITTER_MS = 90;
const MIN_DURATION_MS = 520;
const DURATION_RANGE_MS = 280;
const RESET_DELAY_MS = 2400;
const HALF = 0.5;

const state = ref<ShareState>('idle');
const burstParticles = ref<BurstParticle[]>([]);
const resetTimer = ref<number | undefined>(undefined);
const isNativeSharing = ref(false);

const isSuccess = computed(() => state.value === 'success');

const getRandomBetween = (min: number, range: number): number => (
  min + Math.random() * range
);

const createBurstParticle = (index: number): BurstParticle => {
  const isStar = index % STAR_MODULO === 0;
  const color = index % GOLD_MODULO === 0 ? GOLD_COLOR : WHITE_COLOR;
  const baseAngle = (DEGREES_PER_CIRCLE / PARTICLE_COUNT) * index;
  const angle = baseAngle + (Math.random() - HALF) * ANGLE_JITTER_DEGREES;
  const distance = getRandomBetween(MIN_DISTANCE, DISTANCE_RANGE);
  const size = isStar
    ? getRandomBetween(MIN_STAR_SIZE, STAR_SIZE_RANGE)
    : getRandomBetween(MIN_DOT_SIZE, DOT_SIZE_RANGE);
  const depth = getRandomBetween(MIN_DEPTH, DEPTH_RANGE);
  const spin = (Math.random() - HALF) * SPIN_RANGE_DEGREES;
  const delay = getRandomBetween(BURST_BASE_DELAY_MS, DELAY_JITTER_MS);
  const duration = getRandomBetween(MIN_DURATION_MS, DURATION_RANGE_MS);
  const offsetX = Math.cos(angle * DEGREES_TO_RADIANS) * distance;
  const offsetY = Math.sin(angle * DEGREES_TO_RADIANS) * distance;

  return {
    id: index,
    isStar,
    style: {
      '--tx': `${offsetX.toFixed(1)}px`,
      '--ty': `${offsetY.toFixed(1)}px`,
      '--tz': `${depth.toFixed(1)}px`,
      '--spin': `${spin.toFixed(0)}deg`,
      width: `${size.toFixed(1)}px`,
      height: `${size.toFixed(1)}px`,
      color,
      animationDelay: `${delay.toFixed(0)}ms`,
      animationDuration: `${duration.toFixed(0)}ms`,
    },
  };
};

const copyPageUrl = (): void => {
  navigator.clipboard.writeText(window.location.href)
    .catch(() => {
    // Clipboard access can be denied; the checkmark feedback still plays
    });
};

const playSuccess = (): void => {
  burstParticles.value = Array.from(
    { length: PARTICLE_COUNT },
    (_, index) => createBurstParticle(index),
  );
  state.value = 'success';

  resetTimer.value = window.setTimeout(() => {
    state.value = 'idle';
  }, RESET_DELAY_MS);
};

const isTouchDevice = (): boolean => (
  window.matchMedia('(hover: none) and (pointer: coarse)').matches
);

const canUseNativeShare = (): boolean => (
  isTouchDevice() && typeof navigator.share === 'function'
);

const openNativeShare = (): void => {
  isNativeSharing.value = true;

  navigator.share({
    title: document.title,
    url: window.location.href,
  })
    .then(() => {
      playSuccess();
    })
    .catch(() => {
      // The user dismissed the share sheet — no success feedback needed
    })
    .finally(() => {
      isNativeSharing.value = false;
    });
};

const handleShare = (): void => {
  if (isSuccess.value || isNativeSharing.value) {
    return;
  }

  if (canUseNativeShare()) {
    openNativeShare();

    return;
  }

  copyPageUrl();
  playSuccess();
};

onBeforeUnmount(() => {
  if (resetTimer.value !== undefined) {
    window.clearTimeout(resetTimer.value);
  }
});
</script>

<style scoped>
/* Pressing pushes the button back down to the surface with a slight squash */
.share-button:active,
.share-button:hover:active {
  transform: translateZ(var(--elevation-step)) scale(0.95);
}

.share-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transform-style: preserve-3d;
}

.share-icon {
  position: relative;
  width: 18px;
  height: 18px;
  transform-style: preserve-3d;
}

.share-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Idle-direction transitions redraw the connectors after the dots pop back */
.share-line {
  stroke-dasharray: 9;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.16s ease-out 0.42s;
}

.share-line-bottom {
  transition-delay: 0.47s;
}

/* On success the connectors retract into the hub dot first */
.share-button[data-state="success"] .share-line {
  stroke-dashoffset: 9;
  transition: stroke-dashoffset 0.13s ease-in;
}

.share-button[data-state="success"] .share-line-bottom {
  transition-delay: 0.04s;
}

/* Idle-direction transitions spring the dots back into place */
.share-dot {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.share-dot-first {
  transition-delay: 0.2s;
}

.share-dot-second {
  transition-delay: 0.28s;
}

.share-dot-third {
  transition-delay: 0.24s;
}

/* On success the dots inhale outward, then get sucked into the icon center */
.share-button[data-state="success"] .share-dot {
  transition: transform 0.2s cubic-bezier(0.55, -0.2, 0.75, 0.4);
}

.share-button[data-state="success"] .share-dot-first {
  transform: translate(-6px, 7px) scale(0);
  transition-delay: 0.05s;
}

.share-button[data-state="success"] .share-dot-second {
  transform: translate(6px, 0) scale(0);
  transition-delay: 0.12s;
}

.share-button[data-state="success"] .share-dot-third {
  transform: translate(-6px, -7px) scale(0);
  transition-delay: 0.08s;
}

/* Hidden by a full dash offset; idle-direction transition un-draws it quickly */
.check-mark {
  stroke-dasharray: 22;
  stroke-dashoffset: 22;
  stroke-width: 2.4;
  transform: scale(0.5) rotate(-12deg);
  transform-box: fill-box;
  transform-origin: center;
  transition: stroke-dashoffset 0.15s ease-in, transform 0.15s ease-in;
}

/* The check draws itself while springing upright, with a one-shot glow */
.share-button[data-state="success"] .check-mark {
  stroke-dashoffset: 0;
  transform: scale(1) rotate(0deg);
  animation: check-glow 0.7s ease-out 0.3s;
  transition: stroke-dashoffset 0.3s cubic-bezier(0.65, 0, 0.35, 1) 0.3s, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s;
}

.share-burst {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.burst-flash {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  background: radial-gradient(circle, #fff 0%, #fff0 70%);
  border-radius: 50%;
  opacity: 0;
  animation: burst-flash 0.45s ease-out 0.28s;
}

.burst-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
  border: 2px solid #fff;
  border-radius: 50%;
  opacity: 0;
  animation: burst-ring 0.55s cubic-bezier(0.17, 0.67, 0.35, 1) 0.28s;
}

/* The defaults below are overridden per particle via inline style from the script */
.burst-particle {
  --tx: 0;
  --ty: 0;
  --tz: 0;
  --spin: 0deg;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  animation-name: burst-particle;
  animation-timing-function: cubic-bezier(0.16, 0.84, 0.3, 1);
}

.burst-dot {
  background: currentcolor;
  border-radius: 50%;
  box-shadow: 0 0 6px currentcolor;
}

.burst-star-icon {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 3px currentcolor);
}

@keyframes check-glow {
  0% {
    filter: drop-shadow(0 0 0 #fff0);
  }

  35% {
    filter: drop-shadow(0 0 6px #fff);
  }

  100% {
    filter: drop-shadow(0 0 2px #fff0);
  }
}

@keyframes burst-flash {
  0% {
    opacity: 0;
    transform: translateZ(6px) scale(0.2);
  }

  30% {
    opacity: 0.9;
  }

  100% {
    opacity: 0;
    transform: translateZ(6px) scale(1.6);
  }
}

@keyframes burst-ring {
  0% {
    border-width: 3px;
    opacity: 1;
    transform: translateZ(10px) scale(0.25);
  }

  100% {
    border-width: 1px;
    opacity: 0;
    transform: translateZ(10px) scale(2.4);
  }
}

@keyframes burst-particle {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate3d(0, 0, var(--tz)) scale(0) rotate(0deg);
  }

  30% {
    opacity: 1;
    transform: translate(-50%, -50%) translate3d(calc(var(--tx) * 0.7), calc(var(--ty) * 0.7), var(--tz)) scale(1) rotate(calc(var(--spin) * 0.4));
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate3d(var(--tx), var(--ty), var(--tz)) scale(0.2) rotate(var(--spin));
  }
}
</style>
