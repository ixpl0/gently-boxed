<template>
  <div
    class="main-page"
    :class="{ 'frame-glitch': isFrameGlitchActive && side === 'bottom' }"
    :style="{ '--page-background': SIDE_BACKGROUNDS[side] }"
  >
    <Transition name="sparkles-fade">
      <MeteorShower
        v-if="side === 'front'"
        layer="back"
      />
      <GlitchField
        v-else-if="side === 'bottom'"
        layer="back"
      />
      <SparklesSparkles
        v-else
        :key="side"
        :type="SIDE_SPARKLE_TYPES[side]"
        mirrored
      />
    </Transition>

    <TheCube :side="side">
      <template #front>
        <ProfileCard @open-contacts="side = 'back'" />
      </template>

      <template #back>
        <ContactsCard />
      </template>

      <template #left>
        <ExperienceCard />
      </template>

      <template #right>
        <ProjectsCard />
      </template>

      <template #top>
        <WorkflowCard />
      </template>

      <template #bottom>
        <LlmNoteCard />
      </template>
    </TheCube>

    <!-- The near half of the meteor shower paints above the cube, so streaks
         cross over the face while the back layer passes behind it; the front
         glitch layer likewise corrupts the cube itself via backdrop-filter bars -->
    <Transition name="sparkles-fade">
      <MeteorShower
        v-if="side === 'front'"
        layer="front"
      />
      <GlitchField
        v-else-if="side === 'bottom'"
        layer="front"
        @frame-glitch="handleFrameGlitch"
      />
    </Transition>

    <SideNavigation :current-side="side" />
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref,
} from 'vue';
import type { DirectionType, SideType } from '~/utils/sides';
import {
  getRoutePathFromSide, getSideFromRouteParam, SIDE_BACKGROUNDS, SIDE_NEIGHBORS, SIDE_SPARKLE_TYPES,
} from '~/utils/sides';

definePageMeta({
  // Nuxt would otherwise remount the page on every param change, killing the spin transition
  key: 'cube-page',
  validate: (route) => {
    const param = route.params['side'];

    if (param === undefined || param === '') {
      return true;
    }

    return typeof param === 'string' && /^[1-6]$/.test(param);
  },
});

const route = useRoute();
const router = useRouter();

// The URL is the source of truth: spins push /1../6, browser back/forward replay them
const side = computed<SideType>({
  get: () => getSideFromRouteParam(route.params['side']),
  set: (nextSide) => {
    void router.push(getRoutePathFromSide(nextSide));
  },
});

const spinToward = (direction: DirectionType): void => {
  side.value = SIDE_NEIGHBORS[side.value][direction];
};

// Driven by the front GlitchField's burst schedule; gated on the bottom side so a
// burst can never fire the whole-frame filter while the cube is spinning away
const isFrameGlitchActive = ref(false);

const handleFrameGlitch = (isActive: boolean): void => {
  isFrameGlitchActive.value = isActive;
};

const KEY_DIRECTIONS: Record<string, DirectionType> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }

  const direction = KEY_DIRECTIONS[event.key];

  if (!direction) {
    return;
  }

  event.preventDefault();
  spinToward(direction);
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.main-page {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--page-background);

  /* Matches the cube's 2.1s spin so each side's backdrop flows into the next mid-rotation */
  transition: background-color 2.1s;
}

/* Tears the whole rendered frame — background, cube, overlays — row-wise for one
   short burst; the filter def lives inside the front GlitchField instance */
.main-page.frame-glitch {
  filter: url("#glitch-frame-filter");
}

/* Outgoing background particles dissolve while still blinking, overlapping the
   incoming set; entering needs no classes — each particle fades in on its own */
.sparkles-fade-leave-active {
  transition: opacity 2s;
}

.sparkles-fade-leave-to {
  opacity: 0;
}
</style>
