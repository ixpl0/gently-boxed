<template>
  <div class="retro-drive">
    <div class="sky">
      <div
        class="stars"
        data-depth="far"
      >
        <div class="twinkle" />
      </div>

      <div
        class="stars"
        data-depth="near"
      >
        <div class="twinkle" />
      </div>

      <div class="sun-halo" />

      <!-- The synthwave sun: a gradient disc whose slat gaps ride a conveyor.
           Each mask rect travels into the slot of the gap below it over the same
           shared duration, so the loop point lands on an identical frame and the
           stripes scroll toward the viewer forever without a visible cut -->
      <svg
        class="sun"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="drive-sun-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              class="sun-stop-top"
              offset="0"
            />
            <stop
              class="sun-stop-mid"
              offset="0.55"
            />
            <stop
              class="sun-stop-low"
              offset="1"
            />
          </linearGradient>

          <mask id="drive-sun-slats">
            <rect
              x="0"
              y="0"
              width="200"
              height="200"
              fill="#fff"
            />

            <rect
              v-for="(step, index) in SUN_SLAT_STEPS"
              :key="index"
              x="0"
              :y="step.fromY"
              width="200"
              :height="step.fromHeight"
              fill="#000"
            >
              <template v-if="!prefersReducedMotion">
                <animate
                  attributeName="y"
                  :values="`${step.fromY};${step.toY}`"
                  :dur="`${SUN_SLAT_TRAVEL_SECONDS}s`"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="height"
                  :values="`${step.fromHeight};${step.toHeight}`"
                  :dur="`${SUN_SLAT_TRAVEL_SECONDS}s`"
                  repeatCount="indefinite"
                />
              </template>
            </rect>
          </mask>
        </defs>

        <circle
          cx="100"
          cy="100"
          r="97"
          fill="url(#drive-sun-fill)"
          mask="url(#drive-sun-slats)"
        />
      </svg>

      <!-- Distant ridges flanking the road corridor; vector-effect keeps the
           neon ridge line hairline under the non-uniform horizontal stretch -->
      <svg
        class="ridge"
        viewBox="0 0 1200 140"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon
          class="ridge-body"
          points="0,140 0,74 88,98 168,44 258,112 338,66 470,140"
        />
        <polyline
          class="ridge-line"
          points="0,74 88,98 168,44 258,112 338,66 470,140"
          vector-effect="non-scaling-stroke"
        />
        <polygon
          class="ridge-body"
          points="730,140 822,60 900,106 992,38 1082,98 1200,66 1200,140"
        />
        <polyline
          class="ridge-line"
          points="730,140 822,60 900,106 992,38 1082,98 1200,66"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>

    <!-- The drive itself: a perspective-tilted plane carrying the grid and the
         road, translated along its own slope by exactly one grid cell per loop.
         The pattern is cell-periodic, so the snap back is invisible and the
         whole floor is a single static raster the compositor slides forever -->
    <div class="floor">
      <div class="plane">
        <div class="grid-lines" />

        <div class="road">
          <div class="road-sheen" />

          <div class="road-dashes" />
        </div>
      </div>
    </div>

    <!-- The roadside pylons: the only objects in the scene with a real size, so
         they are what actually carries the speed and the scale. They stand in the
         floor's own camera and simply walk along the ground, which is why they
         move exactly as it does — same plane, same constants, same pace -->
    <div class="roadside">
      <div
        v-for="(pylon, index) in ROADSIDE_PYLONS"
        :key="index"
        class="pylon"
        :data-facing="pylon.facing"
        :style="{ '--pylon-phase': String(pylon.phaseRatio) }"
      >
        <div class="pylon-post" />
      </div>
    </div>

    <div class="haze" />

    <div class="horizon-glow" />

    <!-- The lens: a soft falloff into the corners that keeps the eye on the road -->
    <div class="vignette" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

// One conveyor step of the sun's slat mask: over the shared travel time each
// gap slides and thickens from its own slot into the next one down, so at the
// loop point the whole set reproduces the starting frame exactly. The top step
// is born at zero height, the bottom one exits past the disc edge
interface SunSlatStep {
  fromY: number;
  fromHeight: number;
  toY: number;
  toHeight: number;
}

const SUN_SLAT_STEPS: SunSlatStep[] = [
  {
    fromY: 80,
    fromHeight: 0,
    toY: 90,
    toHeight: 4,
  },
  {
    fromY: 90,
    fromHeight: 4,
    toY: 104,
    toHeight: 8,
  },
  {
    fromY: 104,
    fromHeight: 8,
    toY: 122,
    toHeight: 12,
  },
  {
    fromY: 122,
    fromHeight: 12,
    toY: 144,
    toHeight: 16,
  },
  {
    fromY: 144,
    fromHeight: 16,
    toY: 170,
    toHeight: 20,
  },
  {
    fromY: 170,
    fromHeight: 20,
    toY: 202,
    toHeight: 24,
  },
];

// SMIL attributes cannot read CSS custom properties, so the sun's pace lives
// here with the slat geometry it drives (the same contract as the sparkle and
// meteor tables); everything CSS can style stays in the .retro-drive dials
const SUN_SLAT_TRAVEL_SECONDS = 8;

// One post of the roadside fleet. The banks alternate so the two sides never
// sweep past together, and the phases spread evenly over the cycle so the row
// reads as a continuous line of posts receding into the haze. The ratio is
// handed to CSS as a plain number and multiplied by the cycle there, keeping
// the pace itself a single CSS dial
interface RoadsidePylon {
  facing: 'left' | 'right';
  phaseRatio: number;
}

const ROADSIDE_PYLONS: RoadsidePylon[] = [
  {
    facing: 'left',
    phaseRatio: 0,
  },
  {
    facing: 'right',
    phaseRatio: 0.167,
  },
  {
    facing: 'left',
    phaseRatio: 0.333,
  },
  {
    facing: 'right',
    phaseRatio: 0.5,
  },
  {
    facing: 'left',
    phaseRatio: 0.667,
  },
  {
    facing: 'right',
    phaseRatio: 0.833,
  },
];

// Every CSS loop here answers the reduced-motion query, but SMIL does not — and
// no stylesheet can reach a <animate> element, so the sun's conveyor is dropped
// from the tree instead. Resolved after mount so the server render and the
// hydration pass still agree on the markup
const prefersReducedMotion = ref(false);

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
});
</script>

<style scoped>
.retro-drive {
  /* Every look-affecting dial of the drive in one place: the horizon height,
     the grid cell (also the length of one seamless travel loop), the pace,
     the camera (tilt + perspective) and the road/sun geometry */
  --drive-horizon: 50%;
  --drive-cell: 44px;

  /* Approaching cross-lines per grid cell: must stay an integer, so the
     cross pattern remains periodic within the one-cell loop slide */
  --drive-cross-per-cell: 2;
  --drive-tilt: 78deg;
  --drive-perspective: 200px;
  --drive-plane-width: 130vw;

  /* The plane stops projecting onto the screen once it crosses the camera
     plane at perspective / sin(tilt) along its own slope — anything deeper is
     invisible texture waste; two extra cells of margin cover the loop slide */
  --drive-plane-depth: calc(var(--drive-perspective) / sin(var(--drive-tilt)) + var(--drive-cell) * 2);
  --drive-road-width: 130px;
  --drive-road-line: 4px;
  --drive-dash-width: 4px;
  --drive-line-core: 2px;
  --drive-cross-core: 1px;
  --drive-line-glow: 5px;

  /* Raster density of the floor: the plane's layout is inflated by this factor
     and pushed back with translateZ so the projected image stays identical
     while the compositor's texture gains that many texels per screen pixel —
     the perspective magnification of the near rows stops smearing the lines */
  --drive-raster-boost: 4;

  /* One full cycle of the starfield's outward drift */
  --drive-star-drift: 80s;

  /* The two constants that tie anything standing on the floor to the floor
     itself. A cell of grid advances the world this far along the camera axis,
     so measuring travel in cells makes a post's speed the grid's speed by
     construction; and a point sitting on the floor at depth z projects to
     z * cot(tilt) below the horizon, which is the whole of the geometry */
  --drive-cell-depth: calc(var(--drive-cell) * sin(var(--drive-tilt)));
  --drive-floor-cot: calc(cos(var(--drive-tilt)) / sin(var(--drive-tilt)));

  /* The roadside posts: real objects in the floor's own perspective, so the
     browser does the projection and the whole life of a post is one straight
     line travelled at constant speed. Travel is counted in grid cells, which is
     what keeps them locked to the ground rushing underneath */
  --drive-pylon-cells-back: 2;
  --drive-pylon-cells-front: 4;
  --drive-pylon-cycle: calc(var(--drive-speed) * (var(--drive-pylon-cells-back) + var(--drive-pylon-cells-front)));
  --drive-pylon-offset: 120px;
  --drive-pylon-width: 7px;
  --drive-pylon-height: 150px;

  /* The haze that dissolves the far rows — and the posts standing among them —
     before either can alias. It reaches above the horizon line, because the
     floor's true vanishing point sits a little higher than the drawn seam */
  --drive-haze-rise: 46px;
  --drive-haze-height: 132px;


  /* Proportional to the window so the crown arc always clears the top edge:
     68% of the disc stands above the horizon, which itself sits at 50% */
  --drive-sun-size: 72vh;
  --drive-sun-sink: 32%;
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  animation: drive-fade-in 2s ease;
}

/* The dusk falling toward the hot horizon band the sun sets into */
.sky {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: var(--drive-horizon);
  overflow: hidden;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--color-page-left) 55%, #000 45%) 0%, var(--color-page-left) 46%, color-mix(in oklab, var(--color-page-left) 58%, var(--color-accent-left) 42%) 84%, color-mix(in oklab, var(--color-accent-left) 62%, var(--color-drive-sun) 38%) 100%);
}

/* Two star tiles slowly drifting outward from the vanishing point — the sky
   sliding past a moving planet, stars falling behind. The layers run the same
   cycle half a period apart and fade at both ends, so the scale reset is
   always hidden inside an invisible layer and the sky never empties; the mask
   thins the stars toward the horizon where the sun's glow owns the sky */
.stars {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><g fill='white'><circle cx='12' cy='30' r='1.1'/><circle cx='58' cy='12' r='0.8' opacity='0.7'/><circle cx='96' cy='44' r='1.3'/><circle cx='140' cy='20' r='0.9' opacity='0.8'/><circle cx='180' cy='60' r='1.2'/><circle cx='210' cy='14' r='0.8' opacity='0.6'/><circle cx='30' cy='84' r='0.9' opacity='0.75'/><circle cx='120' cy='96' r='1.1'/><circle cx='200' cy='110' r='0.8' opacity='0.6'/><circle cx='70' cy='130' r='1.2'/><circle cx='160' cy='150' r='0.9' opacity='0.8'/><circle cx='20' cy='180' r='1.1'/><circle cx='100' cy='200' r='0.8' opacity='0.65'/><circle cx='190' cy='190' r='1.3'/><circle cx='228' cy='150' r='0.9' opacity='0.7'/><circle cx='50' cy='220' r='1'/></g></svg>");
  mask-image: linear-gradient(to bottom, #000 55%, transparent 92%);
  transform-origin: 50% 100%;
  animation: star-drift var(--drive-star-drift) linear infinite;
}

.stars[data-depth="far"] {
  --star-alpha: 0.55;
  --star-scale-end: 1.35;
  background-size: 240px 240px;
}

.stars[data-depth="near"] {
  --star-alpha: 0.9;
  --star-scale-end: 1.6;
  background-position: 118px 54px;
  background-size: 340px 340px;
  animation-delay: calc(var(--drive-star-drift) / -2);
}

/* A sparse set of brighter stars riding inside each drifting tile: their own
   opacity animation multiplies into the parent's, so the field breathes in two
   unrelated periods instead of pulsing as one sheet */
.twinkle {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><g fill='white'><circle cx='64' cy='58' r='1.6'/><circle cx='236' cy='30' r='1.4'/><circle cx='348' cy='126' r='1.7'/><circle cx='150' cy='186' r='1.5'/><circle cx='300' cy='268' r='1.6'/><circle cx='42' cy='320' r='1.4'/></g></svg>");
  background-size: 420px 420px;
  animation: star-twinkle 5.5s ease-in-out infinite alternate;
}

.stars[data-depth="near"] .twinkle {
  background-position: 208px 96px;
  animation-duration: 7.4s;
  animation-delay: -3.1s;
}

/* The magenta atmosphere the sun charges the horizon with */
.sun-halo {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: calc(var(--drive-sun-size) * 2.2);
  height: calc(var(--drive-sun-size) * 1.3);
  background: radial-gradient(ellipse 50% 52% at 50% 62%, rgb(from var(--color-accent-left) r g b / 42%), transparent 72%);
  transform: translate(-50%, 32%);
}

.sun {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: var(--drive-sun-size);
  height: var(--drive-sun-size);
  transform: translate(-50%, var(--drive-sun-sink));
}

.sun-stop-top {
  stop-color: var(--color-drive-sun);
}

.sun-stop-mid {
  stop-color: color-mix(in oklab, var(--color-drive-sun) 45%, var(--color-accent-left) 55%);
}

.sun-stop-low {
  stop-color: var(--color-accent-left);
}

.ridge {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.ridge-body {
  fill: color-mix(in oklab, var(--color-page-left) 45%, #000 55%);
}

.ridge-line {
  fill: none;
  stroke: rgb(from var(--color-accent-left) r g b / 45%);
  stroke-width: 1.5;
}

/* The camera: perspective-origin pins the vanishing point to the horizon's
   center. The clip is load-bearing — the plane's last cells of loop margin sit
   behind the camera plane and Chromium still paints them, folded, above the
   horizon; the overflow is what has always been swallowing them */
.floor {
  position: absolute;
  inset: var(--drive-horizon) 0 0 0;
  overflow: hidden;
  perspective: var(--drive-perspective);
  perspective-origin: 50% 0;
}

/* Objects standing on that same floor. It repeats the floor's camera exactly —
   same perspective, same vanishing point on the horizon line — but keeps its
   overflow visible, because anything with height sticks up into the sky and the
   floor's clip would leave it all feet and no head */
.roadside {
  position: absolute;
  inset: var(--drive-horizon) 0 0 0;
  perspective: var(--drive-perspective);
  perspective-origin: 50% 0;
}

/* Atmospheric depth over the far rows: near the horizon the grid compresses
   toward infinite frequency, and this fade dissolves it into haze before the
   shimmer could ever alias. Painted after the roadside, so it swallows the far
   end of the pylon row on its way out too, and reaching a little above the drawn
   seam, because the floor's true vanishing point sits higher than the seam does */
.haze {
  position: absolute;
  top: calc(var(--drive-horizon) - var(--drive-haze-rise));
  right: 0;
  left: 0;
  height: var(--drive-haze-height);
  background: linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--color-page-left) 52%, var(--color-accent-left) 48%) var(--drive-haze-rise), transparent 100%);
}

/* One extra cell of plane sticks out past the horizon (top offset) so the far
   end never uncovers while the loop slides the pattern toward the viewer; the
   transform-origin compensates, keeping the rotation axis on the horizon.
   Everything inside the plane's subtree is sized in boosted units (--plane-*):
   the layout is --drive-raster-boost times larger, and the translateZ in the
   drive keyframes pushes it back so the projection lands pixel-identical */
.plane {
  --plane-cell: calc(var(--drive-cell) * var(--drive-raster-boost));
  --plane-core: calc(var(--drive-line-core) * var(--drive-raster-boost));
  --plane-cross-core: calc(var(--drive-cross-core) * var(--drive-raster-boost));
  --plane-glow: calc(var(--drive-line-glow) * var(--drive-raster-boost));
  position: absolute;
  top: calc(var(--plane-cell) * -1);
  left: 50%;
  width: calc(var(--drive-plane-width) * var(--drive-raster-boost));
  height: calc(var(--drive-plane-depth) * var(--drive-raster-boost));
  margin-left: calc(var(--drive-plane-width) * var(--drive-raster-boost) / -2);
  background-color: color-mix(in oklab, var(--color-page-left) 46%, #000 54%);
  transform-origin: 50% var(--plane-cell);
  animation: drive-forward var(--drive-speed) linear infinite;

  /* A permanent compositor layer, mirroring the cube's own promotion */
  will-change: transform;
}

/* The neon grid, drawn with the road's recipe: hard-edged solid cores whose
   bloom is a real drop-shadow blur, not a gradient ramp baked into the tile —
   a pre-blurred glow survives the near rows' perspective magnification, while
   a baked ramp stretches into what reads as focus blur. Both gradients are
   single-line tiles with the line centered in the tile; background-position
   50% then pins one vertical line exactly to the plane's center (hidden under
   the road), so the grid fans out symmetrically */
.grid-lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, transparent calc(50% - var(--plane-core)), rgb(from var(--color-accent-left) r g b / 85%) calc(50% - var(--plane-core)), rgb(from var(--color-accent-left) r g b / 85%) calc(50% + var(--plane-core)), transparent calc(50% + var(--plane-core))), linear-gradient(to bottom, transparent calc(50% - var(--plane-cross-core)), rgb(from var(--color-accent-left) r g b / 85%) calc(50% - var(--plane-cross-core)), rgb(from var(--color-accent-left) r g b / 85%) calc(50% + var(--plane-cross-core)), transparent calc(50% + var(--plane-cross-core)));
  background-position: 50% 0, 0 0;
  background-size: var(--plane-cell) 100%, 100% calc(var(--plane-cell) / var(--drive-cross-per-cell));
  filter: drop-shadow(0 0 var(--plane-glow) rgb(from var(--color-accent-left) r g b / 75%))
    drop-shadow(0 0 calc(var(--plane-glow) * 3) rgb(from var(--color-accent-left) r g b / 40%));
}

/* The asphalt strip: painted over the grid, edged with neon. It carries the
   side's accent rather than more black, because the plane's own base is already
   near black — a darker roadway vanished into it, and the only lane you could
   actually see was the patch the monolith's reflection happened to tint. The
   roadway now reads across its full width, out to the cyan lines that bound it */
.road {
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(var(--drive-road-width) * var(--drive-raster-boost));
  height: 100%;
  margin-left: calc(var(--drive-road-width) * var(--drive-raster-boost) / -2);
  background-color: color-mix(in oklab, var(--color-page-left) 74%, var(--color-accent-left) 26%);
}

/* The wet sheen: the sun poured down the roadway. It is a child of the road, so
   it is bounded by the lane and by nothing else — uniform across the full width
   out to the cyan lines, varying only with distance, which is the one axis a
   reflection varies along.

   It also has to hold still, and that is what the counter-animation is for. Every
   other pattern on this plane is periodic over one cell, so the plane's one-cell
   loop is invisible on them; a gradient stretched over the whole depth is not, and
   it visibly slid forward and snapped back once per cycle. Running the exact
   inverse of the plane's travel cancels it: the sheen stays put in the scene while
   the road rushes underneath. The extra cell of height covers the strip the
   counter-travel would otherwise uncover at the near end */
.road-sheen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + var(--plane-cell));
  background-image: linear-gradient(to bottom, rgb(from var(--color-drive-sun) r g b / 62%) 14%, rgb(from var(--color-drive-sun) r g b / 46%) 34%, rgb(from var(--color-accent-left) r g b / 40%) 58%, rgb(from var(--color-accent-left) r g b / 30%) 80%, rgb(from var(--color-accent-left) r g b / 20%) 100%);
  animation: sheen-hold var(--drive-speed) linear infinite;
}

.road::before,
.road::after {
  position: absolute;
  top: 0;
  bottom: 0;
  width: calc(var(--drive-road-line) * var(--drive-raster-boost));
  background-color: var(--color-drive-cyan);

  /* Kept tight on purpose: at this camera the near rows magnify roughly tenfold,
     so a generous bloom here washes inward across half the lane and the asphalt
     reads as a thin ribbon floating between two glows instead of a road running
     up to its own edge lines */
  box-shadow: 0 0 calc(6px * var(--drive-raster-boost)) rgb(from var(--color-drive-cyan) r g b / 90%), 0 0 calc(16px * var(--drive-raster-boost)) rgb(from var(--color-drive-cyan) r g b / 42%);
  content: "";
}

.road::before {
  left: 0;
}

.road::after {
  right: 0;
}

/* The center line: dash period equals the grid cell, so it rides the same
   seamless loop as the plane it sits on */
.road-dashes {
  position: absolute;
  top: 0;
  left: 50%;
  width: calc(var(--drive-dash-width) * var(--drive-raster-boost));
  height: 100%;
  margin-left: calc(var(--drive-dash-width) * var(--drive-raster-boost) / -2);
  background-image: repeating-linear-gradient(to bottom, var(--color-drive-sun) 0, var(--color-drive-sun) calc(var(--plane-cell) * 0.45), transparent calc(var(--plane-cell) * 0.45), transparent var(--plane-cell));
  filter: drop-shadow(0 0 calc(8px * var(--drive-raster-boost)) rgb(from var(--color-drive-sun) r g b / 80%));
}

/* A post is an ordinary box standing on the floor: its foot rests on the horizon
   line at zero depth, and the animation only walks it along the camera axis. The
   two-part translate is the floor plane written out — travel z, drop z * cot(tilt)
   — so interpolating both linearly traces a straight line across the ground, and
   the perspective on .floor turns that into the approach for free. One formula
   for the whole life of the post, and it is the same formula the grid obeys */
.pylon {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--drive-pylon-width);
  height: var(--drive-pylon-height);
  margin-top: calc(var(--drive-pylon-height) * -1);
  margin-left: var(--drive-pylon-offset);
  animation: pylon-approach var(--drive-pylon-cycle) linear infinite;
  animation-delay: calc(var(--drive-pylon-cycle) * var(--pylon-phase) * -1);
}

.pylon[data-facing="left"] {
  margin-left: calc((var(--drive-pylon-offset) + var(--drive-pylon-width)) * -1);
}

.pylon-post {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--color-drive-cyan) 0%, rgb(from var(--color-drive-cyan) r g b / 55%) 62%, rgb(from var(--color-accent-left) r g b / 65%) 100%);
  box-shadow: 0 0 9px rgb(from var(--color-drive-cyan) r g b / 85%), 0 0 26px rgb(from var(--color-drive-cyan) r g b / 45%);
}

/* The lamp head, and under it the pool it throws on the ground — both scale with
   the post, so a distant pylon is a single lit speck and a near one arrives with
   its own patch of lit desert */
.pylon-post::before {
  position: absolute;
  top: calc(var(--drive-pylon-width) * -1.1);
  left: calc(var(--drive-pylon-width) * -0.6);
  width: calc(var(--drive-pylon-width) * 2.2);
  height: calc(var(--drive-pylon-width) * 1.4);
  background: var(--color-accent-left);
  border-radius: 40%;
  box-shadow: 0 0 12px rgb(from var(--color-accent-left) r g b / 90%), 0 0 30px rgb(from var(--color-accent-left) r g b / 50%);
  content: "";
}

.pylon-post::after {
  position: absolute;
  bottom: calc(var(--drive-pylon-width) * -1.4);
  left: 50%;
  width: calc(var(--drive-pylon-height) * 0.5);
  height: calc(var(--drive-pylon-height) * 0.12);
  margin-left: calc(var(--drive-pylon-height) * -0.25);
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgb(from var(--color-drive-cyan) r g b / 40%), transparent 72%);
  content: "";
}

/* The hot seam between the two worlds: a soft breathing bloom under a thin
   incandescent core line */
.horizon-glow {
  position: absolute;
  top: var(--drive-horizon);
  right: 0;
  left: 0;
  height: 0;
}

.horizon-glow::before {
  position: absolute;
  top: -70px;
  right: -6%;
  left: -6%;
  height: 140px;
  background: radial-gradient(ellipse 55% 58% at 50% 50%, rgb(from var(--color-accent-left) r g b / 50%), transparent 72%);
  animation: horizon-breathe 7s ease-in-out infinite alternate;
  content: "";
}

.horizon-glow::after {
  position: absolute;
  top: -1px;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgb(from var(--color-accent-left) r g b / 90%) 18%, color-mix(in oklab, var(--color-drive-sun) 55%, #fff 45%) 50%, rgb(from var(--color-accent-left) r g b / 90%) 82%, transparent 100%);
  box-shadow: 0 0 16px rgb(from var(--color-accent-left) r g b / 80%);
  content: "";
}

/* The lens closing on the corners: it sits under the cube, so it darkens the
   scene around the monolith without ever touching the face type */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 84% 80% at 50% 52%, transparent 40%, rgb(from var(--color-page-base) r g b / 56%) 100%);
}

/* The translateZ is the raster-boost camera move: the world is boost times
   larger, so it sits (boost - 1) perspective-lengths farther back and projects
   exactly where the unboosted plane would */
@keyframes drive-forward {
  from {
    transform: translateZ(calc(var(--drive-perspective) * (1 - var(--drive-raster-boost))))
      rotateX(var(--drive-tilt))
      translateY(0);
  }

  to {
    transform: translateZ(calc(var(--drive-perspective) * (1 - var(--drive-raster-boost))))
      rotateX(var(--drive-tilt))
      translateY(var(--plane-cell));
  }
}

@keyframes star-drift {
  0% {
    opacity: 0;
    transform: scale(1);
  }

  10% {
    opacity: var(--star-alpha);
  }

  85% {
    opacity: var(--star-alpha);
  }

  100% {
    opacity: 0;
    transform: scale(var(--star-scale-end));
  }
}

/* The exact inverse of drive-forward's travel, so the two cancel */
@keyframes sheen-hold {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(calc(var(--plane-cell) * -1));
  }
}

@keyframes star-twinkle {
  from {
    opacity: 0.2;
  }

  to {
    opacity: 1;
  }
}

/* Two stops, because the motion is a straight line at constant speed and nothing
   else. Everything that makes it read as an approach — the acceleration, the
   swing out of frame, the growth — is the perspective divide, not the keyframes.
   The opacity stops are the only extras: in at the far end where the haze hands
   the post over, out at the near end for the wide screens where a post is still
   on-frame when its cycle runs out */
@keyframes pylon-approach {
  0% {
    opacity: 0;
    transform: translate3d(0, calc(var(--drive-cell-depth) * var(--drive-pylon-cells-back) * var(--drive-floor-cot) * -1), calc(var(--drive-cell-depth) * var(--drive-pylon-cells-back) * -1));
  }

  12% {
    opacity: 1;
  }

  96% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate3d(0, calc(var(--drive-cell-depth) * var(--drive-pylon-cells-front) * var(--drive-floor-cot)), calc(var(--drive-cell-depth) * var(--drive-pylon-cells-front)));
  }
}

@keyframes horizon-breathe {
  from {
    opacity: 0.72;
  }

  to {
    opacity: 1;
  }
}

@keyframes drive-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

/* The drive stops driving: every loop is stilled into the frame it would have
   held anyway. The posts are the one case that needs a value rather than a
   removal — frozen at their shared base scale they would all stack on the same
   spot, so each keeps its phase as a static depth and the row still recedes */
@media (prefers-reduced-motion: reduce) {
  .plane,
  .road-sheen,
  .stars,
  .twinkle,
  .horizon-glow::before,
  .retro-drive {
    animation: none;
  }

  .stars {
    opacity: var(--star-alpha);
  }

  .pylon {
    transform: translate3d(0, calc(var(--drive-cell-depth) * var(--pylon-phase) * 4 * var(--drive-floor-cot)), calc(var(--drive-cell-depth) * var(--pylon-phase) * 4));
    animation: none;
  }
}
</style>
