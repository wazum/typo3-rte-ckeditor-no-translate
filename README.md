# CKEditor no translate

A button for the TYPO3 rich text editor that marks text as not translatable. The
saved HTML gets `translate="no"`, so Chrome, Edge, DeepL and Azure Translator skip
that text.

Needs TYPO3 13.4 or 14.3.

## Install

```bash
composer require wazum/rte-ckeditor-no-translate
```

## Set it up

The extension ships a preset. Select it in the page TSconfig:

```
RTE.default.preset = no_translate
```

With your own preset, import our configuration file instead:

```yaml
imports:
  - { resource: 'EXT:rte_ckeditor/Configuration/RTE/Default.yaml' }
  - { resource: 'EXT:rte_ckeditor_no_translate/Configuration/RTE/NoTranslate.yaml' }
```

TYPO3 appends list values, so the button lands at the end of your toolbar. Write
your own `toolbar.items` list to place `noTranslate` somewhere else.

## For editors

Marked text gets a yellow background and a dashed underline, plus the tooltip
"Not translated" on hover. The button looks active while the cursor sits in
marked text.

Click the button again to remove the mark. With the cursor inside, the whole mark
goes, like unlink does. With a part selected, only that part loses the mark.

"Remove Format" keeps the mark, because "do not translate" carries meaning and is
no formatting. Links work the same way.

## Options

`editor.config.noTranslate.mode` sets what the editor writes:

| mode                  | output                                      |
| --------------------- | ------------------------------------------- |
| `attribute` (default) | `<span translate="no">`                     |
| `class`               | `<span class="notranslate">`                |
| `both`                | `<span translate="no" class="notranslate">` |

Every mode reads back all three forms. Pick `class` or `both` for the old Google
website translation widget, which looks for the class.

```yaml
editor:
  config:
    noTranslate:
      mode: both
```

## Styling

The editor styles marked text with `Resources/Public/Css/no-translate.css`. Point
`editor.config.contentsCss` to your own file to change the look. That file also
works in the frontend.

## Development

```bash
npm install
npm test
npm run build
ddev exec '.Build/bin/phpunit -c phpunit-functional.xml --testdox'
```

`npm run build` writes `Resources/Public/JavaScript/no-translate.js`, which is
part of the repository. The design notes live in
`docs/superpowers/specs/2026-08-26-ckeditor-no-translate-design.md`.

## Credits

The toolbar icon builds on the `ai-translate` icon from
[CKEditor 5](https://github.com/ckeditor/ckeditor5), without the AI sparkle and
with a slash on top. CKEditor 5 is licensed under GPL-2.0-or-later, the same
license as this extension.

## License

GPL-2.0-or-later
