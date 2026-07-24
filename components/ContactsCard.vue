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

    <div class="links">
      <a
        v-for="link in CONTACT_LINKS"
        :key="link.label"
        class="contact-link"
        :href="link.href"
        :target="opensInNewTab(link.href) ? '_blank' : undefined"
        :rel="opensInNewTab(link.href) ? 'noopener noreferrer' : undefined"
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
  </div>
</template>

<script setup lang="ts">
interface ContactLink {
  label: string;
  href: string;
  iconPath: string;
}

const LINKEDIN_ICON_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';
const GITHUB_ICON_PATH = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
const TELEGRAM_ICON_PATH = 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z';
const EMAIL_ICON_PATH = 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z';
const DOCUMENT_ICON_PATH = 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
const CALENDAR_ICON_PATH = 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z';

// TODO: replace the placeholder urls with real profiles, cv file and booking link
const CONTACT_LINKS: ContactLink[] = [
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
  {
    label: 'Telegram',
    href: 'https://t.me/username',
    iconPath: TELEGRAM_ICON_PATH,
  },
  {
    label: 'Email',
    href: 'mailto:hello@example.com',
    iconPath: EMAIL_ICON_PATH,
  },
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

// mailto stays in the same tab to trigger the mail client; everything else opens a new tab
const opensInNewTab = (href: string): boolean => !href.startsWith('mailto:');
</script>

<style scoped>
.contacts-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
}

.title-lockup {
  position: relative;
  transform-style: preserve-3d;
}

/* The chrome material: an airbrushed sky-to-steel gradient clipped into the
   glyphs, with the genre's hard horizon line cutting through mid-letter. The
   stops are the material itself, not palette colors — tuning the side recolors
   the scene around the chrome, never the chrome */
.chrome-title {
  margin: 0;
  font-family: var(--font-chrome);
  font-size: 46px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background-image: linear-gradient(180deg, #eaf7ff 0%, #9fd8ff 30%, #eaf9ff 44%, #23458c 50%, #cdeeff 54%, #6d95d6 72%, #1d2a55 100%);
  background-clip: text;
  filter: drop-shadow(0 0 14px rgb(from var(--color-drive-cyan) r g b / 35%));
  transform: translateZ(var(--elevation-step));
  -webkit-text-fill-color: transparent;
}

/* The neon sign hanging over the chrome: hot accent script with a triple-halo
   glow and a rare double-dip flicker, like a tube with a tired starter */
.script-tagline {
  position: absolute;
  right: -14px;
  bottom: -30px;
  color: oklch(from var(--side-accent) 80% c h);
  font-family: var(--font-script);
  font-size: 38px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  text-shadow: 0 0 6px rgb(from var(--side-accent) r g b / 90%), 0 0 20px rgb(from var(--side-accent) r g b / 60%), 0 0 46px rgb(from var(--side-accent) r g b / 35%);
  transform: rotate(-7deg) translateZ(calc(var(--elevation-step) + 8px));
  animation: tagline-buzz 9s infinite;
}

.links {
  display: grid;
  grid-template-columns: repeat(2, auto);
  justify-items: start;
  gap: 18px 48px;
  margin-top: 52px;
  transform-style: preserve-3d;
}

/* Neon signage links: cool cyan tubes that answer hover by flipping to the
   hot accent and lifting, keeping the shared bare-text interaction pattern */
.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: oklch(from var(--color-drive-cyan) 88% calc(c * 0.85) h);
  font-family: var(--font-condensed);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgb(from var(--color-drive-cyan) r g b / 55%), 0 0 24px rgb(from var(--color-drive-cyan) r g b / 30%);
  transform: translateZ(var(--elevation-step));
  transition: all 0.2s;

  &:hover {
    color: oklch(from var(--side-accent) 82% c h);
    text-shadow: 0 0 8px rgb(from var(--side-accent) r g b / 70%), 0 0 26px rgb(from var(--side-accent) r g b / 45%);
    transform: translateZ(calc(var(--elevation-step) + 10px));
  }
}

.link-icon {
  display: block;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.link-label {
  white-space: nowrap;
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
</style>
