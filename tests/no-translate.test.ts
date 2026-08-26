import { expect } from '@open-wc/testing';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import type { Element } from '@ckeditor/ckeditor5-engine';
import { NoTranslate } from '#src/no-translate.js';

async function createEditor(config: Record<string, unknown> = {}): Promise<ClassicEditor> {
    const element = document.createElement('div');
    document.body.appendChild(element);

    return ClassicEditor.create(element, {
        licenseKey: 'GPL',
        plugins: [Paragraph, NoTranslate],
        ...config,
    });
}

async function destroyEditor(editor: ClassicEditor): Promise<void> {
    const element = editor.sourceElement;
    await editor.destroy();
    element?.remove();
}

function selectFirstParagraph(editor: ClassicEditor): void {
    editor.model.change((writer) => {
        const paragraph = editor.model.document.getRoot()!.getChild(0) as Element;
        writer.setSelection(paragraph, 'in');
    });
}

describe('NoTranslate', () => {
    let editor: ClassicEditor;

    afterEach(async () => {
        await destroyEditor(editor);
    });

    it('wraps the selected text in a span with translate="no"', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });
});
