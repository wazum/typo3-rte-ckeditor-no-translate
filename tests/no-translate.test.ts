import { expect } from '@open-wc/testing';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import type { ModelElement } from '@ckeditor/ckeditor5-engine';
import type { ButtonView } from '@ckeditor/ckeditor5-ui';
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
        const paragraph = editor.model.document.getRoot()!.getChild(0) as ModelElement;
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

    it('removes the mark when the command runs twice', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p>Bic Cristal</p>');
    });

    it('keeps a span with translate="no" that is already in the content', async () => {
        editor = await createEditor();

        editor.setData('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');

        expect(editor.getData()).to.equal('<p>Ask for <span translate="no">Bic Cristal</span> pens</p>');
    });

    it('reads a span with class notranslate as the same mark', async () => {
        editor = await createEditor();

        editor.setData('<p><span class="notranslate">Bic Cristal</span></p>');

        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });

    it('writes only the class in mode class', async () => {
        editor = await createEditor({ noTranslate: { mode: 'class' } });
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span class="notranslate">Bic Cristal</span></p>');
    });

    it('writes attribute and class in mode both', async () => {
        editor = await createEditor({ noTranslate: { mode: 'both' } });
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.getData()).to.equal('<p><span class="notranslate" translate="no">Bic Cristal</span></p>');
    });

    it('marks the text with the class in the editor view in every mode', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');

        selectFirstParagraph(editor);
        editor.execute('noTranslate');

        expect(editor.editing.view.getDomRoot()!.innerHTML).to.contain('class="notranslate"');
        expect(editor.getData()).to.equal('<p><span translate="no">Bic Cristal</span></p>');
    });

    it('registers a toolbar button that follows the command state', async () => {
        editor = await createEditor();
        editor.setData('<p>Bic Cristal</p>');
        selectFirstParagraph(editor);

        const button = editor.ui.componentFactory.create('noTranslate') as ButtonView;
        expect(button.isOn).to.equal(false);

        editor.execute('noTranslate');

        expect(button.isOn).to.equal(true);
    });
});
