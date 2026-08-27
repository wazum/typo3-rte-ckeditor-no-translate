# Changelog

All notable changes to this extension are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this extension follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-08-27

### Added

- A **Do not translate** button in the rich text editor that marks the selected
  text with `translate="no"`, the HTML attribute that Chrome, Edge, DeepL and
  Azure Translator respect.
- `editor.config.noTranslate.mode` chooses what gets written: the attribute
  (default), `class="notranslate"`, or both. Every mode reads all three forms
  back, so content written before a mode change keeps its mark.
- Marked text is shown with a background, a dashed underline and the tooltip
  **Not translated** in the editor. The button is active while the cursor sits in
  marked text, and one click with the cursor inside removes the whole mark.
- A configuration file for an existing rich text preset, plus the ready made
  preset `no_translate`. Both keep the attribute through the transformation into
  the database, which TYPO3 strips without that configuration.

[Unreleased]: https://github.com/wazum/typo3-rte-ckeditor-no-translate/compare/1.0.0...HEAD
[1.0.0]: https://github.com/wazum/typo3-rte-ckeditor-no-translate/releases/tag/1.0.0
