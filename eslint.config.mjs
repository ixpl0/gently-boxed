// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

export default withNuxt(
  {
    rules: {
      // Semicolon rules (best practices)
      'semi': ['error', 'always'],
      'semi-spacing': ['error',
        {
          before: false,
          after: true,
        }],
      'semi-style': ['error', 'last'],

      // Code style and formatting
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: ['const',
            'let',
            'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const',
            'let',
            'var'],
          next: ['const',
            'let',
            'var'],
        },
        {
          blankLine: 'always',
          prev: 'directive',
          next: '*',
        },
        {
          blankLine: 'any',
          prev: 'directive',
          next: 'directive',
        },
        {
          blankLine: 'always',
          prev: ['case', 'default'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['if',
            'for',
            'while',
            'switch',
            'try'],
        },
        {
          blankLine: 'always',
          prev: ['if',
            'for',
            'while',
            'switch',
            'try'],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
        {
          blankLine: 'always',
          prev: 'function',
          next: '*',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error',
        {
          before: false,
          after: true,
        }],
      'key-spacing': ['error',
        {
          beforeColon: false,
          afterColon: true,
        }],
      'space-before-function-paren': ['error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        }],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error',
        {
          before: true,
          after: true,
        }],
      'brace-style': ['error',
        '1tbs',
        { allowSingleLine: false }],
      'indent': ['error',
        2,
        { SwitchCase: 1 }],
      'quotes': ['error',
        'single',
        { avoidEscape: true }],
      'no-multiple-empty-lines': ['error',
        {
          max: 2,
          maxEOF: 1,
        }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],

      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // General strictness
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'curly': ['error', 'all'],

      // Vue strictness
      'vue/no-v-html': 'error',
      'vue/no-mutating-props': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/no-unused-components': 'error',
      'vue/no-unused-vars': 'error',
      'vue/require-explicit-emits': 'error',

      // Vue style rules
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error',
        {
          singleline: 3,
          multiline: 1,
        }],
      'vue/html-self-closing': ['error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
        }],
      'vue/html-closing-bracket-spacing': ['error',
        {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'always',
        }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/object-curly-spacing': ['error', 'always'], // Обязательные пробелы в Vue template фигурных скобках
      'vue/mustache-interpolation-spacing': ['error', 'always'], // Обязательные пробелы в {{ }} интерполяции
      'vue/attributes-order': ['error',
        {
          order: [
            'DEFINITION',       // is, v-is
            'LIST_RENDERING',   // v-for
            'CONDITIONALS',     // v-if, v-else-if, v-else, v-show, v-cloak
            'RENDER_MODIFIERS', // v-pre, v-once
            'GLOBAL',           // id
            'UNIQUE',           // ref, key
            'TWO_WAY_BINDING',  // v-model
            'OTHER_DIRECTIVES', // v-custom-directive
            'OTHER_ATTR',       // custom props, class, style
            'EVENTS',           // @click, @input
          ],
          alphabetical: false,
        }],
      'vue/first-attribute-linebreak': ['error',
        {
          singleline: 'ignore',
          multiline: 'below',
        }],
      'vue/html-closing-bracket-newline': ['error',
        {
          singleline: 'never',
          multiline: 'always',
        }],
      'vue/multiline-html-element-content-newline': ['error',
        {
          ignoreWhenEmpty: true,
          allowEmptyLines: false,
        }],
    },
  },
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      // Method chaining and arrow functions
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error',
        {
          before: true,
          after: true,
        }],

      // Object and array formatting
      '@stylistic/object-curly-newline': ['error',
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 3,
          },
          ObjectPattern: {
            multiline: true,
            minProperties: 3,
          },
          ImportDeclaration: {
            multiline: true,
            minProperties: 3,
          },
          ExportDeclaration: {
            multiline: true,
            minProperties: 3,
          },
        }],
      '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
      '@stylistic/array-element-newline': ['error',
        {
          ArrayExpression: 'consistent',
          ArrayPattern: { minItems: 3 },
        }],

      // Function formatting
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],

      // Template literals and operators
      '@stylistic/template-curly-spacing': ['error', 'never'],
      '@stylistic/operator-linebreak': ['error', 'before'],

      // Semicolons and commas
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error',
        {
          before: false,
          after: true,
        }],
    },
  },
);
