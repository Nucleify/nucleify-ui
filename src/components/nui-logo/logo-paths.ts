export const DEFAULT_LOGO_SVG = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="20 22 160 160"
  fill="none"
  overflow="visible"
  role="img"
  aria-label="Nucleify holographic cube"
>
  <defs>
    <!--
      filterUnits=userSpaceOnUse is required: vertical strokes have ~0 bbox width,
      so objectBoundingBox filter regions collapse and clip the bloom away.
    -->
    <filter
      id="glow-cyan"
      filterUnits="userSpaceOnUse"
      x="-40"
      y="-40"
      width="280"
      height="280"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter
      id="glow-green"
      filterUnits="userSpaceOnUse"
      x="-40"
      y="-40"
      width="280"
      height="280"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter
      id="glow-purple"
      filterUnits="userSpaceOnUse"
      x="-40"
      y="-40"
      width="280"
      height="280"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter
      id="glow-core"
      filterUnits="userSpaceOnUse"
      x="-40"
      y="-40"
      width="280"
      height="280"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter
      id="glow-side"
      filterUnits="userSpaceOnUse"
      x="-40"
      y="-40"
      width="280"
      height="280"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter
      id="haze"
      filterUnits="userSpaceOnUse"
      x="20"
      y="30"
      width="160"
      height="150"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
    </filter>

    <linearGradient id="face-top" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.03" />
    </linearGradient>
    <linearGradient id="face-left" x1="0%" y1="20%" x2="100%" y2="90%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0e7490" stop-opacity="0.02" />
    </linearGradient>
    <linearGradient id="face-right" x1="100%" y1="20%" x2="0%" y2="90%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#4c1d95" stop-opacity="0.03" />
    </linearGradient>

    <!-- Face-ring strokes (closed paths) - one gradient per face -->
    <linearGradient id="g-ring-top" x1="38" y1="68" x2="162" y2="68" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="45%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="g-ring-left" x1="38" y1="68" x2="100" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="55%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="g-ring-right" x1="162" y1="68" x2="100" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="55%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <linearGradient id="g-back-t" x1="100" y1="34" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="100%" stop-color="#0f3d32" />
    </linearGradient>
    <linearGradient id="g-back-bl" x1="38" y1="136" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0e4a5c" />
      <stop offset="100%" stop-color="#134e4a" />
    </linearGradient>
    <linearGradient id="g-back-br" x1="162" y1="136" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#3b0764" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
  </defs>

  <rect x="20" y="22" width="160" height="160" fill="#000000" fill-opacity="0" />

  <ellipse cx="100" cy="102" rx="58" ry="48" fill="#14b8a6" opacity="0.06" filter="url(#haze)" />
  <ellipse cx="118" cy="88" rx="40" ry="36" fill="#7c3aed" opacity="0.05" filter="url(#haze)" />
  <g opacity="0.9">
    <path d="M100 34 L162 68 L100 102 L38 68 Z" fill="url(#face-top)" />
    <path d="M38 68 L100 102 L100 170 L38 136 Z" fill="url(#face-left)" />
    <path d="M162 68 L100 102 L100 170 L162 136 Z" fill="url(#face-right)" />
  </g>

  <!-- BACK spokes: dark, thin, NO glow -->
  <g stroke-linecap="butt" stroke-linejoin="miter" stroke-width="1.35" opacity="0.92">
    <path d="M100 34 L100 102" stroke="url(#g-back-t)" />
    <path d="M38 136 L100 102" stroke="url(#g-back-bl)" />
    <path d="M162 136 L100 102" stroke="url(#g-back-br)" />
  </g>

  <!--
    Neon via layered wider strokes (no Gaussian on corners — blur turns miters into orbs).
    Outer hex once; front ridges run corner-to-center so glow meets the three dual-ring vertices.
  -->
  <g fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8">
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#67e8f9"
      stroke-width="7"
      opacity="0.16"
    />
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#67e8f9"
      stroke-width="4.2"
      opacity="0.28"
    />
    <path d="M38 68 L100 102" stroke="#22d3ee" stroke-width="7" opacity="0.14" />
    <path d="M38 68 L100 102" stroke="#22d3ee" stroke-width="4.2" opacity="0.26" />
    <path d="M162 68 L100 102" stroke="#a855f7" stroke-width="7" opacity="0.14" />
    <path d="M162 68 L100 102" stroke="#a855f7" stroke-width="4.2" opacity="0.26" />
    <path d="M100 170 L100 102" stroke="#67e8f9" stroke-width="7" opacity="0.14" />
    <path d="M100 170 L100 102" stroke="#67e8f9" stroke-width="4.2" opacity="0.26" />

    <!-- Closed hex seals outer miters; colored segments sit on top -->
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#67e8f9"
      stroke-width="2.2"
      opacity="0.7"
    />
    <path d="M38 68 L100 34" stroke="#4ade80" stroke-width="2.2" />
    <path d="M100 34 L162 68" stroke="#c084fc" stroke-width="2.2" />
    <path d="M162 68 L162 136" stroke="#a855f7" stroke-width="2.2" />
    <path d="M162 136 L100 170" stroke="#818cf8" stroke-width="2.2" />
    <path d="M100 170 L38 136" stroke="#22d3ee" stroke-width="2.2" />
    <path d="M38 136 L38 68" stroke="#22d3ee" stroke-width="2.2" />

    <path d="M38 68 L100 102" stroke="url(#g-ring-left)" stroke-width="2.2" />
    <path d="M162 68 L100 102" stroke="url(#g-ring-right)" stroke-width="2.2" />
    <path d="M100 170 L100 102" stroke="#67e8f9" stroke-width="2.2" />
  </g>
</svg>`;

export const DEFAULT_LOGO_LIGHT_SVG = `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="20 22 160 160"
  fill="none"
  overflow="visible"
  role="img"
  aria-label="Nucleify holographic cube"
>
  <defs>
    <linearGradient id="face-top-light" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#f1f8f3" />
      <stop offset="100%" stop-color="#e8eef4" />
    </linearGradient>
    <linearGradient id="face-left-light" x1="0%" y1="20%" x2="100%" y2="90%">
      <stop offset="0%" stop-color="#e8f4f8" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="face-right-light" x1="100%" y1="20%" x2="0%" y2="90%">
      <stop offset="0%" stop-color="#f0e8f8" />
      <stop offset="100%" stop-color="#e6e4f0" />
    </linearGradient>

    <linearGradient id="g-ring-left-light" x1="38" y1="68" x2="100" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="55%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="g-ring-right-light" x1="162" y1="68" x2="100" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="55%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>

    <linearGradient id="g-back-t-light" x1="100" y1="34" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="100%" stop-color="#2dd4bf" />
    </linearGradient>
    <linearGradient id="g-back-bl-light" x1="38" y1="136" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="100%" stop-color="#67e8f9" />
    </linearGradient>
    <linearGradient id="g-back-br-light" x1="162" y1="136" x2="100" y2="102" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#a5b4fc" />
    </linearGradient>
  </defs>

  <rect x="20" y="22" width="160" height="160" fill="#000000" fill-opacity="0" />

  <g>
    <path d="M100 34 L162 68 L100 102 L38 68 Z" fill="url(#face-top-light)" />
    <path d="M38 68 L100 102 L100 170 L38 136 Z" fill="url(#face-left-light)" />
    <path d="M162 68 L100 102 L100 170 L162 136 Z" fill="url(#face-right-light)" />
  </g>

  <!-- BACK spokes: soft tint, NO glow -->
  <g stroke-linecap="butt" stroke-linejoin="miter" stroke-width="1.5" opacity="0.85">
    <path d="M100 34 L100 102" stroke="url(#g-back-t-light)" />
    <path d="M38 136 L100 102" stroke="url(#g-back-bl-light)" />
    <path d="M162 136 L100 102" stroke="url(#g-back-br-light)" />
  </g>

  <!--
    Neon via layered wider strokes (same technique as dark logo).
    Slightly stronger bloom opacity so glow reads on light surfaces.
  -->
  <g fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="8">
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#22d3ee"
      stroke-width="7"
      opacity="0.22"
    />
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#22d3ee"
      stroke-width="4.4"
      opacity="0.38"
    />
    <path d="M38 68 L100 102" stroke="#0891b2" stroke-width="7" opacity="0.2" />
    <path d="M38 68 L100 102" stroke="#0891b2" stroke-width="4.4" opacity="0.36" />
    <path d="M162 68 L100 102" stroke="#9333ea" stroke-width="7" opacity="0.2" />
    <path d="M162 68 L100 102" stroke="#9333ea" stroke-width="4.4" opacity="0.36" />
    <path d="M100 170 L100 102" stroke="#22d3ee" stroke-width="7" opacity="0.2" />
    <path d="M100 170 L100 102" stroke="#22d3ee" stroke-width="4.4" opacity="0.36" />

    <!-- Crisp neon core -->
    <path
      d="M100 34 L162 68 L162 136 L100 170 L38 136 L38 68 Z"
      stroke="#06b6d4"
      stroke-width="2.8"
      opacity="0.95"
    />
    <path d="M38 68 L100 34" stroke="#16a34a" stroke-width="2.8" />
    <path d="M100 34 L162 68" stroke="#a855f7" stroke-width="2.8" />
    <path d="M162 68 L162 136" stroke="#9333ea" stroke-width="2.8" />
    <path d="M162 136 L100 170" stroke="#6366f1" stroke-width="2.8" />
    <path d="M100 170 L38 136" stroke="#0891b2" stroke-width="2.8" />
    <path d="M38 136 L38 68" stroke="#0891b2" stroke-width="2.8" />

    <path d="M38 68 L100 102" stroke="url(#g-ring-left-light)" stroke-width="2.8" />
    <path d="M162 68 L100 102" stroke="url(#g-ring-right-light)" stroke-width="2.8" />
    <path d="M100 170 L100 102" stroke="#06b6d4" stroke-width="2.8" />
  </g>
</svg>`;

export const DEFAULT_LOGO_COMBINED_SVG = `<div class="nui-logo-pair">
  <div class="nui-logo-variant nui-logo--dark">
${DEFAULT_LOGO_SVG}
  </div>
  <div class="nui-logo-variant nui-logo--light">
${DEFAULT_LOGO_LIGHT_SVG}
  </div>
</div>`;

export const LOGO_LIGHTER_PATH =
  'M1310 30h10l20-20zm50-20 20 20 20 10-20-20zm-120 60h10l20-20zm-50 30c-40 20-40 20 0 10l30-30zm-70 40c-20 10-20 20-20 160v160l10-150c0-150 0-160 20-170 30-20 20-30-10 0m470 190v130l10-140-10-130zm-370-10c0 30 0 50 20 60q15 15 0 0l-10-70-10-40zm-440 30c-70 30-90 120-50 190l30 30-10-20v-10l30 30 70 10c50 10 90-20 120-70 10-30 10-30 10-10h10l-10-20v-20l10-30-10 10c-10 10-10 10-10-10v-20l-10-20-30-40c-40-30-100-30-150 0m990 0c-50 30-80 130-50 170v-10c0-20 0-20 20 10 20 40 70 60 110 60 30 0 50 0 80-30 30-40 30-40 30-100l10-40h10l-20-10-30-30-10-10v-10l-60-20c-40 0-60 0-90 20m-240 150q-15 15 0 0l20-20zm410 70-20 30zl30-30zm150-20-30 40v60c40 70 140 50 140-30 0-50-60-90-110-70M520 580c-30 40-20 90 30 110s100-20 100-80-90-80-130-30m270 90v70l10-80-10-70zm890-30h10v-20zM290 650l20 20 20 10-20-20zm860 40q-15 15 0 0l20-20zm510 0q-15 15 0 0l20-20zM70 780h10l20-20zm580 40h10l20-20zm1520 0h10v-20zm510 150v170l10-160-10-170zM520 850c0 10 0 20 10 10v-30c-10-10-10 0-10 20m820 10c-10 10 0 10 0 0 20 0 20-10 10-10zm-800 20v10l20-10zm2010 70v80l10-70-10-70zM410 930c0 20 0 30 10 20v-40c-10-10-10 0-10 20m1080 0 20 20 20 10-20-20zm-240 70-100 60 50 30c50 30 70 50 50 50l-30 20 90-50 40-30 50 20 50 30 50-30 60-40-210-120zm-380-10 20 10c0 10 10 10 0 0zm950 0 20 10c0 10 10 10 0 0zm540 230v220l10-210-10-210zm180-160q-15 15 0 0l20-20zM950 1180l-110 60 50 40c50 20 60 40 50 50l-10 80 10 70v-140l60-40a161410 161410 0 0 0 180-120c0-10-100-70-120-70zm630-30-60 40 100 50a950 950 0 0 1 130 80l40-40 60-40-60-40-100-60-50-30zm570-20-50 20c-20-10-20-10-10 10 10 10 20 90 20 340 0 440 0 400 20 390l10 10v10h20v10h10l10-20v-50l10 30 10 60v-70c0-40 0-60-20-60l-10-20 10-80 10-90v-480c0-30 0-40-40-10m-1870 80v90l10-80-10-90zm430 540c10 510 10 510 30 520v-10c-20 0-20-20-20-110v-100l40 20 50 30 10-200 10-330v-120l-30-20-40-20-10 80c0 60-10 80-20 90l-10-170zm1160-460-90 50v410a2450 2450 0 0 0 20 390l10 10h20l10-30 10-10v20l-20 30v10l20-20h20l10-10c-20 0 0-730 10-740q30-15 30 480c0 160 0 200 10 190 10-20 20-20 30-10v10h-20c0 20 30 0 40-20a60220 60220 0 0 0-10-820zm-610 80-80 50 80 50 90 50 80-50 90-50c-10-20-150-100-170-100zm250 130-150 80v420c10 470 10 510 40 520l20 20c0 20 0 20 10 0l10-20 10-20 10-390c0-460 0-440 50-480l60-20a13370 13370 0 0 1 30 370h10q-15 15 0 0l20-10 10-10c20 0 20 20 20 340a25870 25870 0 0 0 0-500v-390zM80 1460c-40 20-70 70-60 100v40c10 40 50 80 90 90 80 20 150-40 150-120 0-100-90-160-180-110m2420 0c-70 30-80 140-10 200 20 30 40 30 70 30 100 0 160-130 80-200-20-10-30-30-20-30h-20c-20 0-20 0-10-10 20-20-50-10-90 10m-2060 30q-15 15 0 0l20-20zm600 270v200l40 20c40 20 50 20 50 10a8260 8260 0 0 1 20-380l-60-30-50-30zm-760-180v20l10-10c10-20 0-30-10-10m2120-10 20 20q15 15 0 0zm-1880 80 10 40v-40l-10-40zm-280 30-20 30zl30-30zm-190 0 20 20-10-20-30-20zm550 100v120l10-130-10-110zm2050-100-10 30 20-20 20-30zm-460 110c-10 10 0 10 0 0 20 0 20-10 10-10zm490 320-10 230q-15 15 0 0c20-10 20-30 20-220l-10-210zm-130 20c0 70 10 90 10 60a1450 1450 0 0 0-10-60m-460-90v20l10-10c10-20 0-30-10-10m-1790 20-10 30 20-20 20-30zm1790 150c0 70 10 100 10 60a1710 1710 0 0 0-10-60m-1490-90h10v-20zm1570 30c0 20 0 30 10 20v-40c-10-10-10 0-10 20m30 80 20 20q15 15 0 0zm-320 70-10 30 20-20 20-30zm-650 120 10 50v-100zm870-20c0 10 0 20 10 10v-30c-10-10-10 0-10 20m-1460 80 20 20-10-20-30-20zm1420 10q-15 15 0 0l20-20zm-870 290 20 10zq-15-15 0 0';

export const LOGO_DARKER_PATH =
  'm1230 80-110 70-10 150v160l30 10 40 30-100 60c-90 30-70 150 20 150 10 0 40-10 50-30l200-130c20 0 170 100 200 130 30 40 70 40 100 10 20-20 30-30 30-50 0-50-20-70-70-80l-70-40-20-20 30-20 40-20V180c10-10 0-30-20-40L1350 10zm50 120-60 30v140l40 30c90 60 80 60 160 10l60-30V240l-60-40-70-40zm650 170c50 60 50 130-10 180-20 30-40 30-70 30-40 0-100-40-120-70l-10-20c-10 10 30 80 60 90 20 10 20 20 20 100v90l-90 50-90 50-130-80-140-80-130 80-140 80-90-50-90-50v-90c0-80 0-90 20-90 20-10 50-50 60-90s0-100-30-120v10c40 60 30 120-20 170-30 20-40 20-80 20l-70-10c-30-30-40-30-30-10l30 30c20 0 20 10 20 70v80l-130 70c-140 90-150 90-150 20 0-30 0-30-110-100l-120-80-100 60-130 80-40 20v160l10 160 120 80 130 80v-160l-60-40-70-30V880l60-30 80-40 70 40c60 40 60 40 60 80s0 40-40 70l-40 20v420l-50 20-50 20v20l20 70c0 80-70 140-150 120-40-10-80-50-80-80-20-60-20-60-20-20 10 100 110 160 190 120 40-20 70-60 80-100 0-20 20-40 90-80l80-50v-390l170-100 190-110c10-10 50 10 140 60l120 70 270-150c10-10 70 20 220 110l70 40 130-70 120-70 180 110 190 110v190l10 200 80 50 90 80c10 60 70 110 130 110 100 0 170-120 130-200-20-30-70-70-100-70l10 10 40 30c70 80 20 200-80 200-60 0-110-50-120-110l10-70c20-30 20-30-40-60l-50-20v-410l-30-20c-40-20-40-30-40-70s10-60 90-100l50-20 60 40 70 40v160l-70 40-70 40v160l40-20 130-80 90-50V810l-120-80-140-70-130 70-110 60v50l-10 50-130-80-130-70v-70c0-70 0-80 30-100 30-30 50-80 40-120 0-40-30-80-50-90s-20-10 0 10M740 1080l-130 70v750l-90 60-130 60c-110 20-150 170-60 230 40 30 80 30 120 10 60-20 80-70 80-130-10-40-10-50 30-70l50-20v200c0 220 0 230 70 260 100 50 210-70 150-170-10-30-40-50-80-60l-30-10-10-510v-520l70-40 140-90 70-40-50-30-70-30zm1030-50c-40 30-50 30-40 40a32300 32300 0 0 0 250 150v830c-10 20-40 40-40 20h20v-10c-10-10-20-10-30 10-10 10-10-30-10-190q0-495-30-480l-20 370a4240 4240 0 0 1-30 350l-10 30h-20l-10-10v10l-10 10-10-420-10-400-30-20a2360 2360 0 0 0-310-200l-50-30c-20-10-30-10-70 20l-110 70-240 150c-20 10-20 30-30 640v630l40 20c20 20 40 30 50 20 20-10 20-30 20-340v-900l150-90 160-90 130 70 150 80 30 20v430a55440 55440 0 0 1 30 820l50-10 30-20v-200c0-170 0-200 20-210a1140 1140 0 0 0 50-50l80-30 70-40v180l-40 10c-70 20-120 110-80 180 30 80 130 90 200 30l30-40-10-200 10-200 40 20c40 20 40 30 40 80 0 60 20 100 70 130 40 10 60 10 110-10 40-20 70-70 70-120 0-60-60-120-120-120-10 0-50-10-70-30l-50-30v-70a2690 2690 0 0 1-30 40v-20h-20v-10l-10-10c-20 10-20 30-20-360l-10-340c0-30-20-40-130-110l-140-80zm410 600a8480 8480 0 0 1 10 150l330 190 40 30v250l-190 120-1020 600-930-550-260-160-10-130v-140l180-110 190-110v-70l-10-80-130 80-230 140-130 70v430l110 60 1150 690 70 40 660-400 670-400v-420l-170-110-300-180c-20-20-30-20-30 10m-1050 170v570l10 370 30 20 40 20c20 0 20-30 20-560v-560l-50-20-50-30zm380-160c-50 30-50 10-50 470a2910 2910 0 0 1-30 430c-10 20-10 20-10 0l-10-20-30-10-10-200c-10-150-10-120-10 180v370l60-30 70-40 50-30 30-20V1610z';
