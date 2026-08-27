import { Plugin } from '@ckeditor/ckeditor5-core';
import { AttributeCommand } from '@ckeditor/ckeditor5-basic-styles';

const ATTRIBUTE = 'noTranslate';

export class NoTranslate extends Plugin {
    public static get pluginName() {
        return 'NoTranslate' as const;
    }

    public init(): void {
        const editor = this.editor;

        editor.model.schema.extend('$text', { allowAttributes: ATTRIBUTE });

        editor.conversion.for('downcast').attributeToElement({
            model: ATTRIBUTE,
            view: { name: 'span', attributes: { translate: 'no' } },
        });

        editor.commands.add(ATTRIBUTE, new AttributeCommand(editor, ATTRIBUTE));
    }
}
