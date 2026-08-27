# CKEditor no translate

TYPO3 extension with a CKEditor 5 button that marks selected text as not
translatable. The saved HTML gets `translate="no"`, the standard HTML attribute
that tells browsers and translation services to leave the text alone. Chrome and
Edge, DeepL in HTML mode and Azure Translator all respect it.

Works with TYPO3 13.4 and 14.

## Install

```bash
composer require wazum/rte-ckeditor-no-translate
```

## Use it

The extension brings a ready made preset. Set it for your rich text fields in the
page TSconfig:

```
RTE.default.preset = no_translate
```

If you already have an own preset, import the small configuration file instead:

```yaml
imports:
  - { resource: 'EXT:rte_ckeditor/Configuration/RTE/Default.yaml' }
  - { resource: 'EXT:rte_ckeditor_no_translate/Configuration/RTE/NoTranslate.yaml' }
```

TYPO3 adds list values to the ones that are already there, so the button lands at
the end of your toolbar. To put it somewhere else, write your own `toolbar.items`
list and add `noTranslate` where you want it.

## Options

`editor.config.noTranslate.mode` decides what the editor writes:

| mode                  | output                                      |
| --------------------- | ------------------------------------------- |
| `attribute` (default) | `<span translate="no">`                     |
| `class`               | `<span class="notranslate">`                |
| `both`                | `<span translate="no" class="notranslate">` |

All three forms are read back, whatever the mode is. Use `class` or `both` if you
serve the old Google website translation widget, which looks for the class.

```yaml
editor:
  config:
    noTranslate:
      mode: both
```

## Styling

Marked text gets the class `notranslate` in the editor, in every mode, so editors
can see it. The style comes from
`Resources/Public/Css/no-translate.css`. Replace it with your own file in
`editor.config.contentsCss` if you want it to look different. The same file works
in the frontend.

## Development

```bash
npm install
npm test          # CKEditor plugin tests in a real browser
npm run build     # writes Resources/Public/JavaScript/no-translate.js
ddev exec '.Build/bin/phpunit -c phpunit-functional.xml --testdox'
```

The design decisions are written down in
`docs/superpowers/specs/2026-08-26-ckeditor-no-translate-design.md`.
