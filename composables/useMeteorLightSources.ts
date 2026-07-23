import { shallowRef } from 'vue';
import type { ShallowRef } from 'vue';

interface MeteorLightSources {
  sources: Readonly<ShallowRef<readonly HTMLElement[]>>;
  publish: (elements: readonly HTMLElement[]) => void;
  retract: (elements: readonly HTMLElement[]) => void;
}

// The front meteor layer publishes its streak elements here so MeteorGlow, mounted
// inside the cube's front face, can cast their light onto the poster. A shallowRef
// keeps the DOM elements out of deep reactivity; the array is only replaced wholesale
const lightSourceElements = shallowRef<readonly HTMLElement[]>([]);

const publish = (elements: readonly HTMLElement[]): void => {
  lightSourceElements.value = elements;
};

// Only the owner of the currently published array may clear it: a leave-transitioned
// old shower unmounts seconds after a fresh instance has already published, and must
// not wipe the newcomer's registration
const retract = (elements: readonly HTMLElement[]): void => {
  if (lightSourceElements.value === elements) {
    lightSourceElements.value = [];
  }
};

export const useMeteorLightSources = (): MeteorLightSources => ({
  sources: lightSourceElements,
  publish,
  retract,
});
