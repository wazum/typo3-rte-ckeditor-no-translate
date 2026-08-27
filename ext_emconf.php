<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'CKEditor no translate',
    'description' => 'CKEditor 5 button to mark text as not translatable with translate="no"',
    'category' => 'be',
    'author' => 'Wolfgang Klinger',
    'state' => 'stable',
    'version' => '1.0.0',
    // Supported are TYPO3 13.4 and 14.3 or newer, which composer.json states
    // exactly. A range here holds one span only, so 14.0 to 14.2 stays
    // installable for classic installations, untested.
    'constraints' => [
        'depends' => [
            'php' => '8.2.0-0.0.0',
            'typo3' => '13.4.0-14.99.99',
            'rte_ckeditor' => '13.4.0-14.99.99',
        ],
    ],
];
