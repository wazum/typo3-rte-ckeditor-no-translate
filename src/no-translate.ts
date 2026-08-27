import { Plugin } from '@ckeditor/ckeditor5-core';
import { AttributeCommand } from '@ckeditor/ckeditor5-basic-styles';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import type { ViewElementDefinition } from '@ckeditor/ckeditor5-engine';

const ATTRIBUTE = 'noTranslate';
const CLASS = 'notranslate';
const ICON = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7.2" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M2.8 10h14.4M10 2.8c2.1 2.2 3.2 4.6 3.2 7.2s-1.1 5-3.2 7.2c-2.1-2.2-3.2-4.6-3.2-7.2s1.1-5 3.2-7.2z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M4.6 15.4 15.4 4.6" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>`;

type Mode = 'attribute' | 'class' | 'both';

function viewFor(mode: Mode): ViewElementDefinition {
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

        const command = new AttributeCommand(editor, ATTRIBUTE);
        editor.commands.add(ATTRIBUTE, command);

        editor.ui.componentFactory.add(ATTRIBUTE, (locale) => {
            const button = new ButtonView(locale);

            button.set({
                label: 'Do not translate',
                icon: ICON,
                tooltip: true,
                isToggleable: true,
            });
            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            button.on('execute', () => {
                editor.execute(ATTRIBUTE);
                editor.editing.view.focus();
            });

            return button;
        });
    }
}
