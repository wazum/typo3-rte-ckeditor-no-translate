<?php

return [
    'dependencies' => [
        'backend',
        'rte_ckeditor',
    ],
    'tags' => [
        'backend.form',
    ],
    'imports' => [
        '@wazum/rte-ckeditor-no-translate/' => 'EXT:rte_ckeditor_no_translate/Resources/Public/JavaScript/',
    ],
];
