<template>
  <aside
    class="glitch-tuner"
    @keydown.stop
    @wheel.stop
  >
    <div
      v-for="section in KNOB_SECTIONS"
      :key="section.id"
      class="tuner-section"
    >
      <span class="section-label">{{ section.label }}</span>

      <label
        v-for="knob in section.knobs"
        :key="knob.id"
        class="slider-row"
      >
        <span class="knob-name">{{ knob.label }}</span>
        <input
          class="slider"
          type="range"
          :min="knob.min"
          :max="knob.max"
          :step="knob.step"
          :value="values[knob.id]"
          @input="updateValue(knob, $event)"
        />
        <span class="knob-value">{{ formatValue(knob) }}</span>
      </label>
    </div>

    <div class="actions">
      <button
        class="action-button"
        type="button"
        @click="applyAllValues"
      >
        применить
      </button>
      <button
        class="action-button"
        type="button"
        @click="resetValues"
      >
        сброс
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref,
} from 'vue';

type KnobIdType
  = | 'warpScale'
  | 'rowFrequency'
  | 'noiseOctaves'
  | 'rowContrast'
  | 'morphSeconds'
  | 'dentScale'
  | 'dentHeight'
  | 'glowOpacity'
  | 'fringeOpacity'
  | 'noiseOpacity'
  | 'scanlineOpacity'
  | 'scanlineStep';

interface KnobConfig {
  id: KnobIdType;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  apply: (value: number) => void;
}

interface KnobSection {
  id: string;
  label: string;
  knobs: readonly KnobConfig[];
}

// TEMPORARY tuning panel for the bottom side's glitch pass, the numeric sibling of
// ColorTuner: SVG knobs write straight onto the #interference-warp-filter primitives
// (they cannot consume CSS variables), CSS knobs override the band's custom
// properties inline on <html> exactly like ColorTuner overrides the palette. The
// picked numbers get read off a screenshot and baked back into GlitchField.vue.
// The filter exists only while the bottom side is active; after a side round-trip
// the fresh instance carries stock attributes, so "применить" re-applies the panel
const findWarpPrimitive = (selector: string): Element | null => document.querySelector(`#interference-warp-filter ${selector}`);

const findWarpPrimitives = (selector: string): readonly Element[] => Array.from(document.querySelectorAll(`#interference-warp-filter ${selector}`));

const applyWarpScale = (value: number): void => {
  findWarpPrimitive('feDisplacementMap[result="torn-frame"]')
    ?.setAttribute('scale', `${value}`);
};

// Negative values flip the pull against the band's travel (the latex dragged up
// instead of down)
const applyDentScale = (value: number): void => {
  findWarpPrimitive('feDisplacementMap[result="dented-frame"]')
    ?.setAttribute('scale', `${value}`);
};

const applyDentHeight = (value: number): void => {
  document.documentElement.style.setProperty('--band-dent-height', `${value}px`);
};

const applyRowFrequency = (value: number): void => {
  findWarpPrimitives('feTurbulence')
    .forEach((noise) => {
      noise.setAttribute('baseFrequency', `0 ${value}`);
    });
};

const applyNoiseOctaves = (value: number): void => {
  findWarpPrimitives('feTurbulence')
    .forEach((noise) => {
      noise.setAttribute('numOctaves', `${Math.round(value)}`);
    });
};

// Keeps the row noise centered on 0.5 while stretching its spread: offset mirrors
// the gain, same shape as the stock "1.6 … -0.3" matrix in GlitchField
const applyRowContrast = (value: number): void => {
  findWarpPrimitive('feColorMatrix')
    ?.setAttribute('values', `${value} 0 0 0 ${0.5 - value / 2}  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1`);
};

const applyMorphSeconds = (value: number): void => {
  document.documentElement.style.setProperty('--band-warp-morph-seconds', `${value}`);
};

const applyGlowOpacity = (value: number): void => {
  document.documentElement.style.setProperty('--band-glow-opacity', `${value}%`);
};

const applyFringeOpacity = (value: number): void => {
  document.documentElement.style.setProperty('--band-fringe-opacity', `${value}`);
};

const applyNoiseOpacity = (value: number): void => {
  document.documentElement.style.setProperty('--band-noise-opacity', `${value}`);
};

const applyScanlineOpacity = (value: number): void => {
  document.documentElement.style.setProperty('--scanline-opacity', `${value}%`);
};

const applyScanlineStep = (value: number): void => {
  document.documentElement.style.setProperty('--scanline-step', `${value}px`);
};

const TUNED_VARIABLES = [
  '--band-warp-morph-seconds',
  '--band-dent-height',
  '--band-glow-opacity',
  '--band-fringe-opacity',
  '--band-noise-opacity',
  '--scanline-opacity',
  '--scanline-step',
] as const;

const KNOB_SECTIONS: readonly KnobSection[] = [
  {
    id: 'warp',
    label: 'Разрыв (warp)',
    knobs: [
      {
        id: 'warpScale',
        label: 'scale',
        min: 0,
        max: 60,
        step: 1,
        defaultValue: 44,
        unit: 'px',
        apply: applyWarpScale,
      },
      {
        id: 'rowFrequency',
        label: 'freq',
        min: 0.005,
        max: 0.12,
        step: 0.005,
        defaultValue: 0.05,
        apply: applyRowFrequency,
      },
      {
        id: 'noiseOctaves',
        label: 'octaves',
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 4,
        apply: applyNoiseOctaves,
      },
      {
        id: 'rowContrast',
        label: 'contrast',
        min: 0.5,
        max: 3,
        step: 0.1,
        defaultValue: 1.4,
        apply: applyRowContrast,
      },
      {
        id: 'morphSeconds',
        label: 'morph',
        min: 0.5,
        max: 8,
        step: 0.1,
        defaultValue: 2.7,
        unit: 's',
        apply: applyMorphSeconds,
      },
    ],
  },
  {
    id: 'dent',
    label: 'Прогиб (латекс)',
    knobs: [
      {
        id: 'dentScale',
        label: 'scale',
        min: -120,
        max: 120,
        step: 2,
        defaultValue: 56,
        unit: 'px',
        apply: applyDentScale,
      },
      {
        id: 'dentHeight',
        label: 'height',
        min: 120,
        max: 520,
        step: 10,
        defaultValue: 270,
        unit: 'px',
        apply: applyDentHeight,
      },
    ],
  },
  {
    id: 'band',
    label: 'Полоса',
    knobs: [
      {
        id: 'glowOpacity',
        label: 'glow',
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 19,
        unit: '%',
        apply: applyGlowOpacity,
      },
      {
        id: 'fringeOpacity',
        label: 'fringe',
        min: 0,
        max: 0.6,
        step: 0.02,
        defaultValue: 0.04,
        apply: applyFringeOpacity,
      },
      {
        id: 'noiseOpacity',
        label: 'noise',
        min: 0,
        max: 0.8,
        step: 0.02,
        defaultValue: 0.4,
        apply: applyNoiseOpacity,
      },
    ],
  },
  {
    id: 'scanlines',
    label: 'Интерлейсинг',
    knobs: [
      {
        id: 'scanlineOpacity',
        label: 'opacity',
        min: 0,
        max: 15,
        step: 0.5,
        defaultValue: 10,
        unit: '%',
        apply: applyScanlineOpacity,
      },
      {
        id: 'scanlineStep',
        label: 'step',
        min: 2,
        max: 8,
        step: 1,
        defaultValue: 3,
        unit: 'px',
        apply: applyScanlineStep,
      },
    ],
  },
];

const createDefaultValues = (): Record<KnobIdType, number> => KNOB_SECTIONS
  .flatMap((section) => section.knobs)
  .reduce(
    (accumulator, knob) => ({
      ...accumulator,
      [knob.id]: knob.defaultValue,
    }),
    {} as Record<KnobIdType, number>,
  );

const values = ref<Record<KnobIdType, number>>(createDefaultValues());

const applyAllValues = (): void => {
  KNOB_SECTIONS.forEach((section) => {
    section.knobs.forEach((knob) => {
      knob.apply(values.value[knob.id]);
    });
  });
};

const updateValue = (knob: KnobConfig, event: Event): void => {
  const input = event.target;

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const value = Number(input.value);

  values.value = {
    ...values.value,
    [knob.id]: value,
  };

  knob.apply(value);
};

const resetValues = (): void => {
  values.value = createDefaultValues();
  applyAllValues();
};

const formatValue = (knob: KnobConfig): string => `${values.value[knob.id]}${knob.unit ?? ''}`;

onMounted(() => {
  applyAllValues();
});

onBeforeUnmount(() => {
  KNOB_SECTIONS.forEach((section) => {
    section.knobs.forEach((knob) => {
      knob.apply(knob.defaultValue);
    });
  });

  TUNED_VARIABLES.forEach((variable) => {
    document.documentElement.style.removeProperty(variable);
  });
});
</script>

<style scoped>
/* TEMPORARY tuning panel: keydown/wheel are stopped at the root so slider focus
   and scrolling over the panel never spin the cube underneath */
.glitch-tuner {
  position: fixed;
  top: 12px;
  right: 12px;
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

.tuner-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.section-label {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.knob-name {
  width: 54px;
}

.slider {
  width: 130px;
  margin: 0;
}

.knob-value {
  width: 44px;
  text-align: right;
}

.actions {
  display: flex;
  gap: 6px;
}

.action-button {
  padding: 2px 8px;
  color: #fff;
  font-family: inherit;
  font-size: 11px;
  background: rgb(255 255 255 / 12%);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button:hover {
  background: rgb(255 255 255 / 22%);
}
</style>
