import '../../components/nui-button/nui-button.js';
import '../../components/nui-card/nui-card.js';
import '../../components/nui-heading/nui-heading.js';
import { html, type TemplateResult } from 'lit';

export interface GuidePage {
  id: string;
  title: string;
  description: string;
  badge?: string;
  sections: {
    heading: string;
    description?: string;
    code?: string;
    items?: string[];
  }[];
  links?: { label: string; href: string }[];
}

export const GUIDE_PAGES: Record<string, GuidePage> = {
  // --- GETTING STARTED ---
  installation: {
    id: 'installation',
    title: 'Installation',
    description:
      'Get started with Nucleify UI in your project using standard web components.',
    sections: [
      {
        heading: 'Install Package',
        description:
          'Install nucleify-ui via your favorite package manager (npm, pnpm, or yarn):',
        code: 'npm install nucleify-ui',
      },
      {
        heading: 'Import Components',
        description:
          'Import the components you need directly into your JavaScript or TypeScript files. Custom elements register automatically.',
        code: `// Import individual components
import 'nucleify-ui/components/nui-button/nui-button.js';
import 'nucleify-ui/components/nui-accordion/nui-accordion.js';

// Or import all components
import 'nucleify-ui';`,
      },
      {
        heading: 'Framework Agnostic',
        description:
          'Nucleify UI works natively in Vanilla JS, React, Vue, Svelte, Angular, Solid, or Lit with zero config.',
        items: [
          'No bundling requirements — standard ES Modules',
          'Compatible with Vite, Next.js, Nuxt, Astro, and SvelteKit',
          'Shadow DOM encapsulation prevents CSS conflicts',
        ],
      },
    ],
  },

  configuration: {
    id: 'configuration',
    title: 'Configuration & Theming',
    description:
      'Configure global theme tokens, runtime presets, style overrides, and custom element defaults.',
    sections: [
      {
        heading: 'Applying Theme Presets',
        description:
          'Initialize your application with one of our designer presets and choose between dark or light mode:',
        code: `import { applyPreset, nucleus } from 'nucleify-ui/themes';

// Apply preset globally
applyPreset(nucleus, { mode: 'dark' });`,
      },
      {
        heading: 'Custom Presets with definePreset()',
        description:
          'Extend existing presets or customize semantic tokens such as primary brand colors, surface backgrounds, and typography scales:',
        code: `import { definePreset, nucleus, emerald } from 'nucleify-ui/themes';

const myBrandTheme = definePreset(nucleus, {
  name: 'my-brand-theme',
  semantic: {
    primary: {
      color: '#6366f1',
      hoverColor: '#4f46e5',
      focusColor: 'rgba(99, 102, 241, 0.4)',
      secondaryColor: 'rgba(99, 102, 241, 0.1)',
    },
    surface: {
      cardBackground: 'rgba(255, 255, 255, 0.03)',
      border: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

applyPreset(myBrandTheme, { mode: 'dark' });`,
      },
      {
        heading: 'Global CSS Custom Properties',
        description:
          'You can also customize individual design tokens directly in your global stylesheet at the :root level:',
        code: `:root {
  /* Brand & Accents */
  --nui-primary-color: #10b981;
  --nui-primary-focus-color: rgba(16, 185, 129, 0.4);
  --nui-primary-highlight-color: rgba(16, 185, 129, 0.12);

  /* Typography */
  --font-family-base: 'Instrument Sans', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Surfaces & Borders */
  --nui-content-background: #0f1117;
  --nui-card-background: #141721;
  --nui-card-border: rgba(255, 255, 255, 0.08);

  /* Border Radii & Animation */
  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --transition-fast: 0.15s ease;
}`,
      },
      {
        heading: 'Component-Level Style Overrides',
        description:
          'Override internal Shadow DOM styles for specific components before they load using nucleifyStyles:',
        code: `import { nucleifyStyles } from 'nucleify-ui';

nucleifyStyles({
  'nui-button': '/custom-button-theme.css',
  'nui-card': () => import('./my-card.css', { with: { type: 'css' } }),
});`,
      },
      {
        heading: 'TypeScript & Typings',
        description:
          'Full TypeScript interfaces and JSX/HTML typings are exported for seamless pair programming and IntelliSense:',
        code: `import type { NuiButton, Preset, ThemeMode } from 'nucleify-ui';

const btn = document.querySelector<NuiButton>('nui-button');
btn?.setAttribute('label', 'Save changes');`,
      },
    ],
  },

  // --- THEMING ---
  'styled-mode': {
    id: 'styled-mode',
    title: 'Styled Mode',
    description:
      'Use pre-built designer presets with rich animations, gradients, and polished states.',
    sections: [
      {
        heading: 'Applying Theme Presets',
        description:
          'Choose between Nucleus, Quantum, Kinetic, Cosmos, Apex, Eclipse, Prism, or Abyss presets:',
        code: `import { applyPreset, nucleus } from 'nucleify-ui/themes';

// Apply preset in dark or light mode
applyPreset(nucleus, { mode: 'dark' });`,
      },
      {
        heading: 'Dynamic Mode Switching',
        description:
          'Toggle seamlessly between light and dark modes at runtime without reloading:',
        code: `// Switch active theme mode
applyPreset(nucleus, { mode: 'light' });`,
      },
      {
        heading: 'Available Presets',
        items: [
          'Nucleus — The flagship emerald/cyan balanced modern theme',
          'Quantum — High-tech violet and indigo with electric neon accents',
          'Kinetic — Dynamic sports orange & vibrant amber energetic vibe',
          'Cosmos — Deep space nebula purples and celestial starlight glows',
          'Apex — Sleek enterprise monochrome with platinum accents',
          'Eclipse — Deep obsidian dark mode with subtle moonlit contrasts',
          'Prism — Refractive rainbow aesthetics with multi-color spectrum shifts',
          'Abyss — Pitch black ultra-deep contrast with bioluminescent teal highlights',
        ],
      },
    ],
  },

  'unstyled-mode': {
    id: 'unstyled-mode',
    title: 'Unstyled Mode',
    description:
      'Strip all default aesthetic styles to apply your own custom CSS or design system.',
    sections: [
      {
        heading: 'Using the unstyled Attribute',
        description:
          'Every Nucleify component supports an unstyled property/attribute that removes default visuals while preserving layout and ARIA accessibility:',
        code: `<nui-button unstyled class="my-custom-button">
  Custom Button
</nui-button>`,
      },
      {
        heading: 'Global Unstyled Setting',
        description:
          'You can set components to be unstyled by default across your entire application:',
        code: `import { setGlobalConfig } from 'nucleify-ui';

setGlobalConfig({
  unstyled: true
});`,
      },
    ],
  },

  'isolated-mode': {
    id: 'isolated-mode',
    title: 'Isolated Mode',
    description:
      'Run Nucleify components inside strict shadow roots isolated from host page styles.',
    sections: [
      {
        heading: 'Shadow DOM Boundary',
        description:
          'Components encapsulate their DOM tree using Shadow DOM. Host application CSS cannot unintentionally leak in or break internal element layout.',
      },
      {
        heading: 'Styling with CSS Parts',
        description:
          'Target internal elements securely using the ::part() pseudo-element selector:',
        code: `/* Style the container inside a scroll panel */
nui-scroll-panel::part(content) {
  padding: 1rem;
}`,
      },
    ],
  },

  // --- COMMUNITY & SUPPORT ---
  github: {
    id: 'github',
    title: 'GitHub Repository',
    description:
      'Nucleify UI is open source! Explore the source code, open issues, and contribute.',
    sections: [
      {
        heading: 'Open Source Community',
        description:
          'Join developers building modern web components across frameworks. Star the repo, report bugs, or submit pull requests.',
        items: [
          'Full source code with 100% test coverage',
          'Automated CI/CD pipelines and type checks',
          'Comprehensive issue tracking and feature discussions',
        ],
      },
      {
        heading: 'Quick Links',
        description:
          'Visit our official GitHub repository and npm registry page:',
      },
    ],
    links: [
      {
        label: 'GitHub: nucleify / nucleify-ui',
        href: 'https://github.com/nucleify/nucleify-ui',
      },
      {
        label: 'npm: nucleify-ui',
        href: 'https://www.npmjs.com/package/nucleify-ui',
      },
      {
        label: 'Releases & Changelog',
        href: 'https://github.com/nucleify/nucleify-ui/releases',
      },
    ],
  },

  discord: {
    id: 'discord',
    title: 'Discord Community',
    description:
      'Connect with the Nucleify UI team, ask questions, share your projects, and get help.',
    sections: [
      {
        heading: 'Chat with us',
        description:
          'Our Discord server is the best place to ask questions, showcase what you have built with Nucleify, and give feedback on upcoming features.',
        items: [
          '#general — General questions and discussions',
          '#showcase — Show off your web components and applications',
          '#feedback — Suggest features and share design ideas',
          '#announcements — Stay up to date with new releases and themes',
        ],
      },
    ],
    links: [{ label: 'Join Discord Server', href: 'https://discord.com' }],
  },

  contributing: {
    id: 'contributing',
    title: 'Contributing Guide',
    description:
      'We can use help in a bunch of areas and any help is greatly appreciated!',
    sections: [
      {
        heading: 'AI Assistance Notice',
        description:
          'If you are using any kind of AI assistance to contribute to Nucleify, it must be disclosed in the pull request description along with the extent of usage (e.g., "This PR was written primarily by Cursor" or "I consulted ChatGPT to understand the codebase but the solution was fully authored manually by myself"). Providing this helps reviewers apply the right level of scrutiny.',
      },
      {
        heading: 'Getting Started',
        description: 'Requirements: Node.js (v22+), pnpm, Make.',
        code: `git clone https://github.com/Nucleify/nucleify
cd nucleify
make setup

# Start the apps
make web       # http://localhost:7777
make admin     # http://localhost:8888
make docs      # documentation`,
      },
      {
        heading: 'Testing & Automated Checks',
        description:
          'pre-commit and pre-push hooks run automatically: btest, Biome check, TypeScript typeslint, Stylelint (SCSS), and Vitest.',
        code: `pnpm tests        # Run Vitest (frontend + shared modules)
pnpm test:watch   # Watch mode`,
      },
      {
        heading: 'Branches & Commit Messages',
        description:
          'Use snake_case for branch names (e.g. nuc_colors, ui_corrections). We follow the Conventional Commits specification:',
        items: [
          'feat: — New feature',
          'fix: — Bug fix',
          'refactor: — Code change without behavior change',
          'docs: — Documentation',
          'test: — Test changes',
          'ci: — CI/CD changes',
          'chore: — Housekeeping',
          'perf: — Performance improvements',
          'Include the module name in brackets when applicable: feat(nuc_colors): implement custom color tokens',
        ],
      },
      {
        heading: 'Creating Pull Requests & Code Review',
        items: [
          'Target the dev branch',
          'Use a conventional commit-formatted PR title',
          'Update documentation if the PR introduces or changes a feature',
          'Follow CODE_STANDARDS.md and write clear, self-explanatory PR descriptions',
          'Include tests for new functionality and respond constructively to review comments',
        ],
      },
    ],
  },

  'code-of-conduct': {
    id: 'code-of-conduct',
    title: 'Contributor Covenant Code of Conduct',
    description:
      'Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to community leaders at nucleify@gmail.com.',
    sections: [
      {
        heading: 'Our Pledge',
        description:
          'We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual identity and orientation. We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.',
      },
      {
        heading: 'Our Standards',
        items: [
          'Demonstrating empathy and kindness toward other people',
          'Being respectful of differing opinions, viewpoints, and experiences',
          'Giving and gracefully accepting constructive feedback',
          'Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience',
          'Focusing on what is best not just for us as individuals, but for the overall community',
          'Unacceptable: sexualized language or imagery, trolling, derogatory comments, personal attacks, public or private harassment, and publishing private information without permission',
        ],
      },
      {
        heading: 'Enforcement Responsibilities & Scope',
        description:
          'Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful. This applies within all community spaces and when an individual is officially representing the community in public spaces.',
      },
      {
        heading: 'Enforcement Guidelines',
        items: [
          '1. Correction: Use of inappropriate language or unprofessional behavior — Private written warning and explanation; apology may be requested.',
          '2. Warning: A violation through a single incident or series of actions — Warning with consequences for continued behavior and specified interaction ban.',
          '3. Temporary Ban: A serious violation of community standards — Temporary ban from public communication and interaction for a specified period.',
          '4. Permanent Ban: A pattern of violation, sustained harassment, or aggression — Permanent ban from any public interaction within the community.',
        ],
      },
    ],
  },

  license: {
    id: 'license',
    title: 'BSD 3-Clause License',
    description:
      'Copyright (c) 2026, Szymon Radomski (SzymCode) & Atomic IT sp. z o.o.',
    sections: [
      {
        heading: 'Redistribution and Use Terms',
        description:
          'Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:',
        items: [
          '1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.',
          '2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.',
          '3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.',
        ],
      },
      {
        heading: 'Full License Text',
        code: `BSD 3-Clause License

Copyright (c) 2026, Szymon Radomski (SzymCode) & Atomic IT sp. z o.o.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
      },
    ],
  },

  security: {
    id: 'security',
    title: 'Security Policy',
    description:
      'Official security reporting guidelines and vulnerability scope for Nucleify.',
    sections: [
      {
        heading: 'Reporting a Vulnerability',
        description:
          'If you discover a security vulnerability, please report it by emailing nucleify@gmail.com. Please do not open public issues for security-related reports. We recommend always using the latest versions of Nucleify, its official modules, and companion libraries to ensure your application remains as secure as possible.',
      },
      {
        heading: 'Scope',
        description: 'This security policy applies to:',
        items: [
          'Nucleify core',
          'Official Nucleify modules',
          'Official companion libraries',
        ],
      },
      {
        heading: 'Out of Scope',
        description:
          'The following are not considered valid security issues: XSS via template expressions when untrusted content is intentionally used as a template compilation source. This can only occur if the user knowingly uses untrusted content as a template compilation source (comparable to manually executing untrusted scripts in a browser console). Users are explicitly warned against this usage in the documentation.',
      },
    ],
  },
};

export function renderGuidePage(page: GuidePage): TemplateResult {
  return html`
    <div class="guide-page">
      <header class="guide-header">
        <nui-heading
          class="guide-title"
          tag="2"
          text=${page.title}
          unstyled
        ></nui-heading>
        ${
          page.badge ? html`<span class="guide-badge">${page.badge}</span>` : ''
        }
        <p class="guide-description">${page.description}</p>
      </header>

      <div class="guide-content">
        ${page.sections.map(
          (section) => html`
            <section class="guide-section">
              <nui-heading
                class="guide-section-heading"
                tag="3"
                text=${section.heading}
                unstyled
              ></nui-heading>
              ${
                section.description
                  ? html`<p class="guide-section-text">${section.description}</p>`
                  : ''
              }
              ${
                section.code
                  ? html`<pre class="guide-code"><code>${section.code}</code></pre>`
                  : ''
              }
              ${
                section.items && section.items.length > 0
                  ? html`
                    <ul class="guide-list">
                      ${section.items.map(
                        (item) =>
                          html`<li class="guide-list-item">${item}</li>`,
                      )}
                    </ul>
                  `
                  : ''
              }
            </section>
          `,
        )}

        ${
          page.links && page.links.length > 0
            ? html`
              <section class="guide-section guide-links-section">
                <nui-heading
                  class="guide-section-heading"
                  tag="3"
                  text="External Links"
                  unstyled
                ></nui-heading>
                <div class="guide-links-grid">
                  ${page.links.map(
                    (link) => html`
                      <a
                        class="guide-link-card"
                        href=${link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <span class="guide-link-label">${link.label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </a>
                    `,
                  )}
                </div>
              </section>
            `
            : ''
        }
      </div>
    </div>
  `;
}
