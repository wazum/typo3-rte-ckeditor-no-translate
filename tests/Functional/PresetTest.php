<?php

declare(strict_types=1);

namespace Wazum\RteCkeditorNoTranslate\Tests\Functional;

use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Configuration\Loader\YamlFileLoader;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

final class PresetTest extends FunctionalTestCase
{
    protected array $coreExtensionsToLoad = ['rte_ckeditor'];

    protected array $testExtensionsToLoad = ['rte_ckeditor_no_translate'];

    #[Test]
    public function theImportedPluginModulePointsToAnExistingFile(): void
    {
        $modules = $this->preset()['editor']['config']['importModules'];
        $plugin = array_values(array_filter(
            $modules,
            static fn (array $module): bool => in_array('NoTranslate', $module['exports'] ?? [], true)
        ));

        self::assertCount(1, $plugin, 'The preset does not import the NoTranslate plugin');
        self::assertFileExists($this->resolveModule($plugin[0]['module']));
    }

    #[Test]
    public function theEditorStylesheetPointsToAnExistingFile(): void
    {
        foreach ($this->preset()['editor']['config']['contentsCss'] as $file) {
            self::assertFileExists(GeneralUtility::getFileAbsFileName($file));
        }
    }

    #[Test]
    public function theToolbarContainsTheButton(): void
    {
        self::assertContains('noTranslate', $this->preset()['editor']['config']['toolbar']['items']);
    }

    #[Test]
    public function theJavaScriptModuleIsTaggedForTheBackendForm(): void
    {
        self::assertContains('backend.form', $this->javaScriptModules()['tags'] ?? [], 'TYPO3 13.4 renders the import map of a package only when it carries this tag');
    }

    private function preset(): array
    {
        return GeneralUtility::makeInstance(YamlFileLoader::class)
            ->load('EXT:rte_ckeditor_no_translate/Configuration/RTE/Preset.yaml');
    }

    private function javaScriptModules(): array
    {
        return require GeneralUtility::getFileAbsFileName(
            'EXT:rte_ckeditor_no_translate/Configuration/JavaScriptModules.php'
        );
    }

    private function resolveModule(string $module): string
    {
        $imports = $this->javaScriptModules();

        foreach ($imports['imports'] as $prefix => $target) {
            if (str_starts_with($module, $prefix)) {
                return GeneralUtility::getFileAbsFileName($target . substr($module, strlen($prefix)));
            }
        }

        self::fail(sprintf('No import map entry matches "%s"', $module));
    }
}
