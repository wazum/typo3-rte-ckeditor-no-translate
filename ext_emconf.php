<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'CKEditor no translate',
    'description' => 'CKEditor 5 button to mark text as not translatable with translate="no"',
    'category' => 'be',
    'author' => 'Wolfgang Klinger',
    'state' => 'stable',
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'php' => '8.2.0-0.0.0',
            'typo3' => '13.4.0-14.3.99',
            'rte_ckeditor' => '13.4.0-14.3.99',
        ],
    ],
];
