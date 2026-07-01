module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Design tokens often use custom properties; keep them flexible.
    'custom-property-pattern': null,

    // We intentionally allow kebab-case class naming.
    'selector-class-pattern': null,

    // In component CSS we frequently target host attributes.
    'selector-attribute-quotes': 'always',

    // Keep rules pragmatic for a design system codebase.
    'custom-property-empty-line-before': null,
    'rule-empty-line-before': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'alpha-value-notation': null,

    // Component styles often use :not() chains and intentional specificity ordering.
    'selector-not-notation': null,
    'no-descending-specificity': null,

    // Prefer explicit min/max-width media queries.
    'media-feature-range-notation': null,

    // Prefer pragmatism over style-only churn in existing CSS.
    'declaration-empty-line-before': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'no-duplicate-selectors': null,
    'length-zero-no-unit': null,
    'color-hex-length': null,
    'property-no-vendor-prefix': null,
    'property-no-deprecated': null,
    'value-keyword-case': null,
    'import-notation': null,
    'shorthand-property-no-redundant-values': null,
  },
};
