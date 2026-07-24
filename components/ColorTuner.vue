<template>
  <aside
    class="color-tuner"
    @keydown.stop
    @wheel.stop
  >
    <div
      v-for="group in tunedGroups"
      :key="group.id"
      class="tuner-group"
    >
      <span class="group-label">{{ group.label }}</span>

      <label class="slider-row">
        <span class="channel-name">H</span>
        <input
          class="slider"
          type="range"
          min="-180"
          max="180"
          step="1"
          :value="group.shift.hue"
          @input="updateShift(group.id, 'hue', $event)"
        />
        <span class="channel-value">{{ formatShift(group.shift.hue) }}°</span>
      </label>

      <label class="slider-row">
        <span class="channel-name">S</span>
        <input
          class="slider"
          type="range"
          min="-100"
          max="100"
          step="1"
          :value="group.shift.saturation"
          @input="updateShift(group.id, 'saturation', $event)"
        />
        <span class="channel-value">{{ formatShift(group.shift.saturation) }}</span>
      </label>

      <label class="slider-row">
        <span class="channel-name">L</span>
        <input
          class="slider"
          type="range"
          min="-40"
          max="40"
          step="1"
          :value="group.shift.lightness"
          @input="updateShift(group.id, 'lightness', $event)"
        />
        <span class="channel-value">{{ formatShift(group.shift.lightness) }}</span>
      </label>

      <div
        v-for="target in group.targets"
        :key="target.variable"
        class="result-row"
      >
        <span
          class="result-swatch"
          :style="{ background: target.resultHex }"
        />
        <span class="result-hex">{{ target.label }} {{ target.resultHex }}</span>
      </div>
    </div>

    <button
      class="reset-button"
      type="button"
      @click="resetShifts"
    >
      сброс
    </button>
  </aside>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, watchEffect,
} from 'vue';

type GroupIdType = 'page' | 'paper' | 'checkers';

type ChannelType = 'hue' | 'saturation' | 'lightness';

interface TuneTarget {
  variable: string;
  label: string;
  baseHex: string;
}

interface TuneGroup {
  id: GroupIdType;
  label: string;
  targets: readonly TuneTarget[];
}

interface ShiftState {
  hue: number;
  saturation: number;
  lightness: number;
}

interface HslColor {
  hue: number;
  saturation: number;
  lightness: number;
}

// KEEP THIS COMPONENT even while nothing mounts it — it's the reusable palette
// tuning tool: the user remounts <ColorTuner /> in pages/[[side]].vue and retargets
// TUNE_GROUPS at another side's variables to pick that side's colors, then reads
// the deltas/result hexes off a screenshot and bakes them back into the palette.
// Base hexes must mirror the current :root palette in assets/css/global.css; the
// panel overrides the same variables inline on <html>, so every var()-derived
// color follows live.
//
// Now aimed at the back ("How I work") side: the aqua pool behind the cube, the
// paper base the face surface is color-mixed from (also the CMYK yellow plate in
// the color bar), and the warm magenta ink the checkerboard sectors and the face
// accent derive from. Inside a group every target shifts from its own base, so a
// multi-target group (as the front side's page + gradient pair was) moves as a
// body without losing its internal contrast
const TUNE_GROUPS: readonly TuneGroup[] = [
  {
    id: 'page',
    label: 'Фон страницы',
    targets: [
      {
        variable: '--color-page-back',
        label: 'page',
        baseHex: '#2afbff',
      },
    ],
  },
  {
    id: 'paper',
    label: 'Бумага грани',
    targets: [
      {
        variable: '--color-back-paper',
        label: 'paper',
        baseHex: '#fff216',
      },
    ],
  },
  {
    id: 'checkers',
    label: 'Шашечки',
    targets: [
      {
        variable: '--color-accent-back',
        label: 'checkers',
        baseHex: '#ff82a6',
      },
    ],
  },
];

const hexToHsl = (hex: string): HslColor => {
  const red = parseInt(hex.slice(1, 3), 16) / 255;
  const green = parseInt(hex.slice(3, 5), 16) / 255;
  const blue = parseInt(hex.slice(5, 7), 16) / 255;
  const maxChannel = Math.max(red, green, blue);
  const minChannel = Math.min(red, green, blue);
  const lightness = (maxChannel + minChannel) / 2;
  const delta = maxChannel - minChannel;

  if (delta === 0) {
    return {
      hue: 0,
      saturation: 0,
      lightness: lightness * 100,
    };
  }

  const saturation = (delta / (1 - Math.abs(2 * lightness - 1))) * 100;

  if (maxChannel === red) {
    return {
      hue: 60 * (((green - blue) / delta + 6) % 6),
      saturation,
      lightness: lightness * 100,
    };
  }

  if (maxChannel === green) {
    return {
      hue: 60 * ((blue - red) / delta + 2),
      saturation,
      lightness: lightness * 100,
    };
  }

  return {
    hue: 60 * ((red - green) / delta + 4),
    saturation,
    lightness: lightness * 100,
  };
};

const channelToHex = (channel: number): string => Math.round(channel * 255)
  .toString(16)
  .padStart(2, '0');

const hslToHex = ({
  hue, saturation, lightness,
}: HslColor): string => {
  const saturationRatio = saturation / 100;
  const lightnessRatio = lightness / 100;
  const chroma = (1 - Math.abs(2 * lightnessRatio - 1)) * saturationRatio;
  const hueSector = (((hue % 360) + 360) % 360) / 60;
  const secondComponent = chroma * (1 - Math.abs((hueSector % 2) - 1));
  const offset = lightnessRatio - chroma / 2;
  const sectorColors: readonly [number, number, number][] = [
    [chroma, secondComponent, 0],
    [secondComponent, chroma, 0],
    [0, chroma, secondComponent],
    [0, secondComponent, chroma],
    [secondComponent, 0, chroma],
    [chroma, 0, secondComponent],
  ];
  const sector = sectorColors[Math.min(Math.floor(hueSector), 5)];

  if (!sector) {
    return '#000000';
  }

  const [red,
    green,
    blue] = sector;

  return `#${channelToHex(red + offset)}${channelToHex(green + offset)}${channelToHex(blue + offset)}`;
};

const shiftHex = (baseHex: string, shift: ShiftState): string => {
  const base = hexToHsl(baseHex);
  const shiftedSaturation = Math.min(100, Math.max(0, base.saturation + shift.saturation));
  const shiftedLightness = Math.min(100, Math.max(0, base.lightness + shift.lightness));

  return hslToHex({
    hue: base.hue + shift.hue,
    saturation: shiftedSaturation,
    lightness: shiftedLightness,
  });
};

const createInitialShifts = (): Record<GroupIdType, ShiftState> => ({
  page: {
    hue: 0,
    saturation: 0,
    lightness: 0,
  },
  paper: {
    hue: 0,
    saturation: 0,
    lightness: 0,
  },
  checkers: {
    hue: 0,
    saturation: 0,
    lightness: 0,
  },
});

const shifts = ref<Record<GroupIdType, ShiftState>>(createInitialShifts());

const tunedGroups = computed(() => TUNE_GROUPS.map((group) => {
  const shift = shifts.value[group.id];

  return {
    ...group,
    shift,
    targets: group.targets.map((target) => ({
      ...target,
      resultHex: shiftHex(target.baseHex, shift),
    })),
  };
}));

const updateShift = (groupId: GroupIdType, channel: ChannelType, event: Event): void => {
  const input = event.target;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  shifts.value = {
    ...shifts.value,
    [groupId]: {
      ...shifts.value[groupId],
      [channel]: Number(input.value),
    },
  };
};

const resetShifts = (): void => {
  shifts.value = createInitialShifts();
};

const formatShift = (value: number): string => (value > 0 ? `+${value}` : `${value}`);

// The watcher is registered on mount so the DOM writes never run during SSR;
// created inside the hook it still binds to the component and stops on unmount
onMounted(() => {
  watchEffect(() => {
    tunedGroups.value.forEach((group) => {
      group.targets.forEach((target) => {
        document.documentElement.style.setProperty(target.variable, target.resultHex);
      });
    });
  });
});

onBeforeUnmount(() => {
  TUNE_GROUPS.forEach((group) => {
    group.targets.forEach((target) => {
      document.documentElement.style.removeProperty(target.variable);
    });
  });
});
</script>

<style scoped>
/* TEMPORARY tuning panel: keydown/wheel are stopped at the root so slider focus
   and scrolling over the panel never spin the cube underneath */
.color-tuner {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px;
  color: #fff;
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  font-size: 11px;
  line-height: 1.4;
  background: rgb(0 0 0 / 72%);
  border-radius: 8px;
}

.tuner-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.group-label {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.channel-name {
  width: 10px;
}

.slider {
  width: 150px;
  margin: 0;
}

.channel-value {
  width: 36px;
  text-align: right;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.result-swatch {
  width: 10px;
  height: 10px;
  border: 1px solid rgb(255 255 255 / 25%);
  border-radius: 2px;
}

.result-hex {
  color: rgb(255 255 255 / 75%);
}

.reset-button {
  align-self: flex-start;
  padding: 2px 8px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  background: rgb(255 255 255 / 12%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reset-button:hover {
  background: rgb(255 255 255 / 22%);
}
</style>
