import { Plugin } from '@ckeditor/ckeditor5-core';
import { AttributeCommand } from '@ckeditor/ckeditor5-basic-styles';
import type { ElementDefinition } from '@ckeditor/ckeditor5-engine';

const ATTRIBUTE = 'noTranslate';
const CLASS = 'notranslate';

type Mode = 'attribute' | 'class' | 'both';

function viewFor(mode: Mode): ElementDefinition {
    if (mode === 'class') {
        return { name: 'span', classes: CLASS };
    }

    if (mode === 'both') {
        return { name: 'span', classes: CLASS, attributes: { translate: 'no' } };
    }

    return { name: 'span', attributes: { translate: 'no' } };
}

export class NoTranslate extends Plugin {
    public static get pluginName() {
        return 'NoTranslate' as const;
    }

    public init(): void {
        const editor = this.editor;

        editor.config.define('noTranslate', { mode: 'attribute' });

        editor.model.schema.extend('$text', { allowAttributes: ATTRIBUTE });

        editor.conversion.for('dataDowncast').attributeToElement({
            model: ATTRIBUTE,
            view: viewFor(editor.config.get('noTranslate.mode') as Mode),
        });

        editor.conversion.for('editingDowncast').attributeToElement({
            model: ATTRIBUTE,
            view: { name: 'span', classes: CLASS },
        });

        editor.conversion.for('upcast').elementToAttribute({
            model: ATTRIBUTE,
            view: { name: 'span', attributes: { translate: 'no' } },
        });

        editor.conversion.for('upcast').elementToAttribute({
            model: ATTRIBUTE,
            view: { name: 'span', classes: CLASS },
        });

        editor.commands.add(ATTRIBUTE, new AttributeCommand(editor, ATTRIBUTE));
    }
}
