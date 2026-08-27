<?php

declare(strict_types=1);

namespace Wazum\RteCkeditorNoTranslate\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Configuration\Loader\YamlFileLoader;
use TYPO3\CMS\Core\Html\RteHtmlParser;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class RteTransformationTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['rte_ckeditor'];

    protected array $testExtensionsToLoad = ['rte_ckeditor_no_translate'];

    #[Test]
    public function keepsTheTranslateAttributeOnTheWayToTheDatabase(): void
    {
        $html = '<p>Ask for <span translate="no">Bic Cristal</span> pens</p>';

        $result = GeneralUtility::makeInstance(RteHtmlParser::class)
            ->transformTextForPersistence($html, $this->processingConfiguration());

        self::assertStringContainsString('<span translate="no">Bic Cristal</span>', $result);
    }

    #[Test]
    public function keepsTheTranslateAttributeOnTheWayBackToTheEditor(): void
    {
        $html = '<p>Ask for <span translate="no">Bic Cristal</span> pens</p>';

        $result = GeneralUtility::makeInstance(RteHtmlParser::class)
            ->transformTextForRichTextEditor($html, $this->processingConfiguration());

        self::assertStringContainsString('<span translate="no">Bic Cristal</span>', $result);
    }

    #[Test]
    public function keepsTheOtherSpanAttributesThatTypo3AllowsByDefault(): void
    {
        $html = '<p><span class="brand" lang="en" title="Pen" dir="ltr" translate="no">Bic Cristal</span></p>';

        $result = GeneralUtility::makeInstance(RteHtmlParser::class)
            ->transformTextForPersistence($html, $this->processingConfiguration());

        foreach (['class="brand"', 'lang="en"', 'title="Pen"', 'dir="ltr"', 'translate="no"'] as $attribute) {
            self::assertStringContainsString($attribute, $result);
        }
    }

    private function processingConfiguration(): array
    {
        $preset = GeneralUtility::makeInstance(YamlFileLoader::class)
            ->load('EXT:rte_ckeditor_no_translate/Configuration/RTE/Preset.yaml');

        return GeneralUtility::makeInstance(TypoScriptService::class)
            ->convertPlainArrayToTypoScriptArray($preset['processing']);
    }
}
