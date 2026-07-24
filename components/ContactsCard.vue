<template>
  <div class="contacts-card">
    <!-- The retrowave lockup: a chrome display headline crossed by a neon
         script tagline, the genre's canonical title pairing -->
    <div class="title-lockup">
      <h2 class="chrome-title">
        Contacts
      </h2>

      <span class="script-tagline">get in touch</span>
    </div>

    <!-- The face's own horizon, echoing the one the scene draws behind it -->
    <div class="horizon-rule" />

    <!-- The one address that matters, lit as a real neon tube: a white core
         inside a magenta halo, against the cool cyan signage below it -->
    <div class="primary-contact">
      <a
        class="primary-mail"
        :href="`mailto:${EMAIL_ADDRESS}`"
      >{{ EMAIL_ADDRESS }}</a>

      <button
        class="copy-button"
        type="button"
        :aria-label="isEmailCopied ? 'Email address copied' : 'Copy email address'"
        @click="copyEmailAddress"
      >
        <svg
          class="copy-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="isEmailCopied ? CHECK_ICON_PATH : COPY_ICON_PATH"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <div class="links">
      <a
        v-for="link in PROFILE_LINKS"
        :key="link.label"
        class="contact-link"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="link-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="link.iconPath"
            fill="currentColor"
          />
        </svg>

        <span class="link-label">{{ link.label }}</span>
      </a>
    </div>

    <div class="links" data-tier="aside">
      <a
        v-for="link in ASIDE_LINKS"
        :key="link.label"
        class="contact-link"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          class="link-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :d="link.iconPath"
            fill="currentColor"
          />
        </svg>

        <span class="link-label">{{ link.label }}</span>
      </a>
    </div>

    <p class="status">
      <span class="status-pulse" />
      Tbilisi<template v-if="localTime"> &middot; {{ localTime }} local</template> &middot; replies within a day
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref,
} from 'vue';

interface ContactLink {
  label: string;
  href: string;
  iconPath: string;
}

const LINKEDIN_ICON_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';
const GITHUB_ICON_PATH = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
const TELEGRAM_ICON_PATH = 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z';
const DOCUMENT_ICON_PATH = 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
const CALENDAR_ICON_PATH = 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z';
const COPY_ICON_PATH = 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z';
const CHECK_ICON_PATH = 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';

// TODO: replace the placeholder urls with real profiles, cv file and booking link
const EMAIL_ADDRESS = 'hello@example.com';

// The tiers the face reads in: profiles first, then the things you take away
const PROFILE_LINKS: ContactLink[] = [
  {
    label: 'Telegram',
    href: 'https://t.me/username',
    iconPath: TELEGRAM_ICON_PATH,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/username',
    iconPath: LINKEDIN_ICON_PATH,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ixpl0',
    iconPath: GITHUB_ICON_PATH,
  },
];

const ASIDE_LINKS: ContactLink[] = [
  {
    label: 'Download CV',
    href: '/cv.pdf',
    iconPath: DOCUMENT_ICON_PATH,
  },
  {
    label: 'Book a call',
    href: 'https://cal.com/username',
    iconPath: CALENDAR_ICON_PATH,
  },
];

const COPY_FEEDBACK_MS = 1800;
const HOME_TIME_ZONE = 'Asia/Tbilisi';
const LOCAL_TIME_REFRESH_MS = 30_000;

const isEmailCopied = ref(false);
const copyResetTimer = ref<ReturnType<typeof setTimeout>>();

const copyEmailAddress = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(EMAIL_ADDRESS);
  } catch {
    // A denied or unavailable clipboard leaves the mailto link as the way out
    return;
  }

  isEmailCopied.value = true;
  clearTimeout(copyResetTimer.value);

  copyResetTimer.value = setTimeout(() => {
    isEmailCopied.value = false;
  }, COPY_FEEDBACK_MS);
};

// The one honest thing a contacts page can say about response time: what o'clock
// it is where the reply would be written. Filled after mount, so the server
// render and the hydration pass never disagree about a moving value
const localTime = ref('');
const localTimeTimer = ref<ReturnType<typeof setInterval>>();

const updateLocalTime = (): void => {
  localTime.value = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: HOME_TIME_ZONE,
  })
    .format(new Date());
};

onMounted(() => {
  updateLocalTime();
  localTimeTimer.value = setInterval(updateLocalTime, LOCAL_TIME_REFRESH_MS);
});

onBeforeUnmount(() => {
  clearTimeout(copyResetTimer.value);
  clearInterval(localTimeTimer.value);
});
</script>

<style scoped>
.contacts-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 384px;
}

.title-lockup {
  position: relative;
}

/* The chrome material: an airbrushed sky clipped into the glyphs, cut by the
   genre's hard horizon line mid-letter, with the ground below it warm rather
   than dark — a steel-blue underside sinks into this face and loses the bottom
   half of every letter. The stops are the material itself, not palette colors:
   tuning the side recolors the scene around the chrome, never the chrome */
.chrome-title {
  margin: 0;
  font-family: var(--font-chrome);
  font-size: 54px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background-image: linear-gradient(180deg, #f3fbff 0%, #a6dbff 27%, #eaf9ff 46%, #23458c 50%, #ffe6a4 54%, #ffb066 74%, #ff86c4 100%);
  background-clip: text;
  filter: drop-shadow(0 1px 0 rgb(from var(--side-accent) r g b / 55%))
    drop-shadow(0 -1px 0 rgb(from var(--color-drive-cyan) r g b / 40%))
    drop-shadow(0 0 16px rgb(from var(--color-drive-cyan) r g b / 35%));
  -webkit-text-fill-color: transparent;
}

/* The neon sign hanging over the chrome: hot accent script with a triple-halo
   glow and a rare double-dip flicker, like a tube with a tired starter */
.script-tagline {
  position: absolute;
  right: -10px;
  bottom: -34px;
  color: oklch(from var(--side-accent) 80% c h);
  font-family: var(--font-script);
  font-size: 43px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 0 6px rgb(from var(--side-accent) r g b / 90%), 0 0 20px rgb(from var(--side-accent) r g b / 60%), 0 0 46px rgb(from var(--side-accent) r g b / 35%);
  transform: rotate(-7deg);
  animation: tagline-buzz 9s infinite;
}

.horizon-rule {
  width: 100%;
  height: 1px;
  margin-top: 46px;
  background: linear-gradient(90deg, transparent 0%, rgb(from var(--side-accent) r g b / 55%) 20%, rgb(from var(--color-drive-cyan) r g b / 85%) 50%, rgb(from var(--side-accent) r g b / 55%) 80%, transparent 100%);
  box-shadow: 0 0 14px rgb(from var(--color-drive-cyan) r g b / 40%);
}

.primary-contact {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
}

/* A lit tube reads as a white core inside a colored halo, never as flat colored
   text — that split is what separates the primary address from the cyan signage */
.primary-mail {
  color: #fff;
  font-family: var(--font-condensed);
  font-size: 23px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-shadow: 0 0 9px rgb(from var(--side-accent) r g b / 90%), 0 0 26px rgb(from var(--side-accent) r g b / 60%), 0 0 58px rgb(from var(--side-accent) r g b / 32%);
  transition: text-shadow 0.2s;

  &:hover {
    text-shadow: 0 0 7px #fff, 0 0 20px rgb(from var(--side-accent) r g b / 90%), 0 0 52px rgb(from var(--side-accent) r g b / 55%);
  }
}

.copy-button {
  display: inline-flex;
  padding: 3px;
  color: rgb(from var(--color-drive-cyan) r g b / 65%);
  background: none;
  border: none;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: var(--color-drive-cyan);
  }
}

.copy-icon {
  display: block;
  width: 15px;
  height: 15px;
}

.links {
  display: flex;
  justify-content: center;
  gap: 26px;
  margin-top: 26px;
}

.links[data-tier="aside"] {
  gap: 30px;
  margin-top: 15px;
}

/* Cool cyan signage under the hot primary. Hover lights the tube rather than
   moving it: the core goes white, the halo flips to the accent, and a filament
   strikes underneath — the face is flattened, so a translateZ lift would do
   nothing here anyway, and scaling type is uglier than lighting it */
.contact-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: oklch(from var(--color-drive-cyan) 88% calc(c * 0.85) h);
  font-family: var(--font-condensed);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgb(from var(--color-drive-cyan) r g b / 55%), 0 0 24px rgb(from var(--color-drive-cyan) r g b / 30%);
  transition: color 0.2s, text-shadow 0.2s;

  &:hover {
    color: #fff;
    text-shadow: 0 0 8px rgb(from var(--side-accent) r g b / 85%), 0 0 26px rgb(from var(--side-accent) r g b / 55%);
  }
}

.links[data-tier="aside"] .contact-link {
  color: rgb(from var(--color-drive-cyan) r g b / 55%);
  font-size: 11px;
  text-shadow: 0 0 10px rgb(from var(--color-drive-cyan) r g b / 30%);
}

/* The filament, and the strike that lights it. Kept as two flat rules in this
   order because no-descending-specificity wants the bare ::after declared before
   the :hover::after that overrides it */
.contact-link::after {
  position: absolute;
  right: 0;
  bottom: -6px;
  left: 0;
  height: 1px;
  background: var(--side-accent);
  box-shadow: 0 0 8px rgb(from var(--side-accent) r g b / 90%), 0 0 18px rgb(from var(--side-accent) r g b / 50%);
  transform: scaleX(0);
  transition: transform 0.24s;
  content: "";
}

.contact-link:hover::after {
  transform: scaleX(1);
}

.link-icon {
  display: block;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.link-label {
  white-space: nowrap;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 30px 0 0;
  color: rgb(from var(--color-drive-cyan) r g b / 50%);
  font-family: var(--font-condensed);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.status-pulse {
  width: 6px;
  height: 6px;
  background: var(--color-drive-cyan);
  border-radius: 50%;
  box-shadow: 0 0 8px rgb(from var(--color-drive-cyan) r g b / 90%);
  animation: status-pulse 2.6s ease-in-out infinite;
}

@keyframes status-pulse {
  0%,
  100% {
    opacity: 0.35;
  }

  50% {
    opacity: 1;
  }
}

/* Steady neon with one brief double-dip per cycle — a flicker, not a strobe */
@keyframes tagline-buzz {
  0%,
  92.6%,
  100% {
    opacity: 1;
  }

  93.4% {
    opacity: 0.55;
  }

  94.2% {
    opacity: 0.92;
  }

  95% {
    opacity: 0.5;
  }

  96% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .script-tagline,
  .status-pulse {
    animation: none;
  }
}
</style>
