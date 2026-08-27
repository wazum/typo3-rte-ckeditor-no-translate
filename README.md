<p align="center">
  <img src="Resources/Public/Icons/Extension.svg" alt="" width="96" height="96">
</p>
<h1 align="center">TYPO3 CKEditor no translate</h1>
<p align="center"><em>A button for the rich text editor that marks text as not translatable.</em></p>
<br>

[![Tests](https://github.com/wazum/typo3-rte-ckeditor-no-translate/actions/workflows/tests.yml/badge.svg)](https://github.com/wazum/typo3-rte-ckeditor-no-translate/actions/workflows/tests.yml)
[![TYPO3](https://img.shields.io/badge/TYPO3-13.4%20%7C%2014.3-orange.svg)](https://get.typo3.org/)
[![License](https://img.shields.io/badge/License-GPL%20v2%2B-blue.svg)](LICENSE.txt)

The saved HTML gets `translate="no"`, so Chrome, Edge, DeepL and Azure Translator
skip that text.

Needs TYPO3 13.4, or 14.3 and newer.

## Install

```bash
composer require wazum/rte-ckeditor-no-translate
```

## Set it up

Add our file to the imports of your own RTE preset:

```yaml
imports:
  # whatever your preset imports already
  - { resource: 'EXT:rte_ckeditor/Configuration/RTE/Default.yaml' }
  # add this line
  - { resource: 'EXT:rte_ckeditor_no_translate/Configuration/RTE/NoTranslate.yaml' }
```

Import it last. TYPO3 appends list values, so the button lands at the end of your
toolbar. Write your own `toolbar.items` list to place `noTranslate` somewhere else.

For a first look without touching your preset, the extension registers one that
holds the TYPO3 default plus the button:

```
RTE.default.preset = no_translate
```

## For editors

Marked text gets a yellow background and a dashed underline, plus the tooltip
"Not translated" on hover. The button looks active while the cursor sits in
marked text.

Click the button again to remove the mark. With the cursor inside, the whole mark
goes, like unlink does. With a part selected, only that part loses the mark.

"Remove Format" keeps the mark, because "do not translate" carries meaning and is
no formatting. Links work the same way.

## Options

`noTranslate.mode` sets what the editor writes. It goes into the same preset file,
below the imports:

```yaml
imports:
  - { resource: 'EXT:rte_ckeditor/Configuration/RTE/Default.yaml' }
  - { resource: 'EXT:rte_ckeditor_no_translate/Configuration/RTE/NoTranslate.yaml' }

editor:
  config:
    noTranslate:
      mode: both
```

| mode                  | output                                      |
| --------------------- | ------------------------------------------- |
| `attribute` (default) | `<span translate="no">`                     |
| `class`               | `<span class="notranslate">`                |
| `both`                | `<span translate="no" class="notranslate">` |

Every mode reads back all three forms. Pick `class` or `both` for the old Google
website translation widget, which looks for the class.

## Known limits

**`class` and `both` mode need `notranslate` in `allowedClasses`.** A site that
sets `processing.allowedClasses` and leaves out `notranslate` loses the class on
every save. TYPO3 does not drop it, it writes the first allowed class instead
(`HtmlParser::HTMLcleaner()`), so the text picks up a style nobody asked for. Add
`notranslate` to your list. The default `attribute` mode writes no class and stays
clear of this.

**Old `class="notranslate"` markup turns into `translate="no"`.** In the default
mode, existing markers change form as soon as an editor saves the record, even
without touching that text. Leaving them alone is not an option: CKEditor drops
every class that no plugin claims, so the marker would vanish completely. Pick
`both` to keep the class for the Google website widget.

## Styling

The editor styles marked text with `Resources/Public/Css/no-translate.css`. Point
`editor.config.contentsCss` to your own file to change the look. TYPO3 prefixes
these styles with `.ck-content`, so they stay inside the editor.

The frontend needs no CSS. `translate="no"` works without styling.

## Credits

The toolbar icon builds on the `ai-translate` icon from
[CKEditor 5](https://github.com/ckeditor/ckeditor5), without the AI sparkle and
with a slash on top. CKEditor 5 is licensed under GPL-2.0-or-later, the same
license as this extension.

## License

GPL-2.0-or-later
